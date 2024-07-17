# pip uninstall -y farm-haystack haystack-ai
# pip install haystack-ai
# pip install qdrant-haystack
# pip install "sentence-transformers>=2.2.0"
#

import os
import json
from src.database.mongodb.repository import mongo_client
from haystack.components.builders import DynamicChatPromptBuilder
# import gradio as gr
import pandas as pd
from haystack.document_stores.types import DuplicatePolicy
from haystack import Pipeline
from haystack.components.embedders import (
    SentenceTransformersTextEmbedder,
    SentenceTransformersDocumentEmbedder,
)
from haystack.components.generators import OpenAIGenerator
from haystack.dataclasses import ChatMessage, StreamingChunk
from haystack.components.generators.chat import OpenAIChatGenerator
from haystack import Document

# from load_documentstore import load_store
from haystack.dataclasses import ChatMessage
from haystack.components.generators.chat import OpenAIChatGenerator
from haystack_integrations.components.retrievers.qdrant import QdrantEmbeddingRetriever
from haystack.utils import Secret
from haystack_integrations.document_stores.qdrant import QdrantDocumentStore
import time
from haystack_integrations.components.embedders.cohere import (
    CohereDocumentEmbedder,
    CohereTextEmbedder,
)
from qdrant_client import QdrantClient

import time

file_path = "src/service/core/courses.csv"
url_cloud = (
    "https://f15cf5fc-0771-4b8a-aad5-c4f5c6ae1f1d.us-east4-0.gcp.cloud.qdrant.io:6333"
)
api_key = "U5tzMbWaGxk3wDvR9yzHCvnFVsTXosi5BR7qFcb7X_j7JOmo4L7RBA"

# index_name = "ThongTinKhoaHoc"
# model_name = "sentence-transformers/all-mpnet-base-v2"
# embedding_dim = 768
index_name = "ThongTinKhoaHoc_Cohere"
model_name = "embed-multilingual-v3.0"
# model_name = "intfloat/multilingual-e5-large-instruct"
embedding_dim = 1024


def load_collection():
    qdrant_client = QdrantClient(
        # url=url_cloud,
        # api_key=api_key,
        host= "qdrant",
    )

    return qdrant_client


# Create a new column which have content is name + description + skill
def add_content_current_course(filepath: str = file_path):
    df = pd.read_csv(filepath)
    df["content"] = (
        "Course Name: "
        + df["name"]
        + ".With course description: "
        + df["description"]
        + ". And this course will help you for improving skills such as: "
        + df["skills"]
    )
    course_info = dict(
        [
            (i, [x, y, z])
            for i, x, y, z in zip(
                df["name"].str.upper(), df["description"], df["skills"], df["content"]
            )
        ]
    )

    return course_info


# Call instance qdrant cloud
def load_store(
    index_name: str = index_name,
    url: str = url_cloud,
    token: str = api_key,
    embedding_dim: int = embedding_dim,
) -> QdrantDocumentStore:
    print(url)

    return QdrantDocumentStore(
        index=index_name,
        # url=url,
        # api_key=Secret.from_token(token=token),
        host = "qdrant",
        embedding_dim=embedding_dim,
    )
    # "m": 16,
    # Number of neighbours to consider during the index building. Larger the value - more accurate the search, more time required to build index.
    # "ef_construct": 100,
    # Minimal size (in KiloBytes) of vectors for additional payload-based indexing.
    # If payload chunk is smaller than `full_scan_threshold_kb` additional indexing won't be used -
    # in this case full-scan search should be preferred by query planner and additional indexing is not required.
    # Note: 1Kb = 1 vector of size 256

    # Number of parallel threads used for background index building. If 0 - auto selection.
    # "max_indexing_threads": 0,
    # Store HNSW index on disk. If set to false, index will be stored in RAM. Default: false


# Embed info
def embedding_csv(index_name: str = index_name, filepath: str = ".\courses.csv"):
    doc_store = load_store(
        index_name,
        url_cloud,
        api_key,
    )
    df = pd.read_csv(filepath)
    # Use data to initialize Document objects
    urls = list(df["url"].values)
    names = list(df["name"].values)
    instructors = list(df["instructor"].values)
    enrolls = list(df["enroll"].values)
    descriptions = list(df["description"].values)
    skills = list(df["skills"].values)
    relatives = list(df["relative"].values)
    rates = list(df["rate"].values)
    levels = list(df["level"].values)
    images = list(df["image"].values)
    df.fillna(value="", inplace=True)
    # init a document store
    docs = []
    for (
        url,
        name,
        instructor,
        enroll,
        description,
        skill,
        relative,
        rate,
        level,
        image,
    ) in zip(
        urls,
        names,
        instructors,
        enrolls,
        descriptions,
        skills,
        relatives,
        rates,
        levels,
        images,
    ):
        docs.append(
            Document(
                content=f"Course Name: {name}. How to access: {url} .With course description: {description}. And this course will help you for improving skills such as: {skill}",
                meta={
                    "name": name or "",
                    "url": url or "",
                    "instructor": instructor or "",
                    "enroll": enroll or "",
                    "skill": skill or "",
                    "relative": relative or "",
                    "rate": rate or "",
                    "level": level or "",
                    "image": image or "",
                },
            )
        )
    # init embedder
    doc_embedder = CohereDocumentEmbedder(model=model_name)
    # doc_embedder = SentenceTransformersDocumentEmbedder(model=model_name)
    # doc_embedder.warm_up()
    ## Use embedder Embedding file document for Fetch và Indexing
    docs_with_embeddings = doc_embedder.run(docs)
    doc_store.write_documents(
        docs_with_embeddings["documents"], policy=DuplicatePolicy.SKIP
    )
    if doc_store.count_documents() > 0:
        return "Success"
    else:
        return "Fail"


def get_current_collection():
    db = mongo_client["chatbot"]
    cur_collection = db["current_collection"]
    if cur_collection.count_documents({}) == 0:
        cur_collection.find_one_and_update(
            {"current_collection": "ThongTinKhoaHoc_Cohere"},
            {"$set": {"current_collection": "ThongTinKhoaHoc_Cohere"}},
            upsert=True,
        )
    cur_collection = db["current_collection"].find()[0]["current_collection"]
    return cur_collection


# RAG pipeline Q-A system
# def rag_pipe():
#     print(get_current_collection())
#     indexname = get_current_collection()
#     template = """
#     Answer the questions based on the given context. Don't use knowledge from outside. You are LearnWay Assistant bot, your purpose is to provide course information related to user's question. The course information should have name, how to access, skill. Answer with VietNamese language. The answer must be Comprehensive Information.

#     Context:
#     {% for document in documents %}
#         {{ document.content }}
#     {% endfor %}
#     Question: {{ question }}
#     Answer:
#     """
#     docstore = load_store(indexname)
#     if docstore.count_documents() == 0:
#         return 0
#     rag_pipe = Pipeline()
#     # rag_pipe.add_component(
#     #     "embedder", SentenceTransformersTextEmbedder(model=model_name)
#     # )
#     ranker = CohereRanker(api_key=Secret.from_token(api_cohere))
#     rag_pipe.add_component(
#         "embedder",
#         # SentenceTransformersTextEmbedder(model=model_name),
#         CohereTextEmbedder(Secret.from_token(api_cohere),model=model_name)
#     )
#     rag_pipe.add_component(
#         "retriever", QdrantEmbeddingRetriever(document_store=docstore, top_k=15)
#     )
#     rag_pipe.add_component(instance=ranker, name="ranker")
#     rag_pipe.add_component("prompt_builder", PromptBuilder(template=template))
#     rag_pipe.add_component("llm", OpenAIGenerator(model="gpt-3.5-turbo"))
#     rag_pipe.connect("embedder.embedding", "retriever.query_embedding")
#     rag_pipe.connect("retriever.documents", "ranker.documents")
#     rag_pipe.connect("ranker.documents", "prompt_builder.documents")
#     rag_pipe.connect("prompt_builder", "llm")

#     return rag_pipe



# RAG pipeline Q-A system
def rag_pipe():
    print(get_current_collection())
    indexname = get_current_collection()
    docstore = load_store(indexname)
    if docstore.count_documents() == 0:
        return 0
    rag_pipe = Pipeline()
    # rag_pipe.add_component(
    #     "embedder", SentenceTransformersTextEmbedder(model=model_name)
    # )
    # ranker = CohereRanker(model='rerank-multilingual-v3.0')
    rag_pipe.add_component(
        "embedder",
        # SentenceTransformersTextEmbedder(model=model_name),
        CohereTextEmbedder(model=model_name)
    )
    rag_pipe.add_component(
        "retriever", QdrantEmbeddingRetriever(document_store=docstore, top_k=10)
    )
    # rag_pipe.add_component(instance=ranker, name="ranker")
    # rag_pipe.add_component("prompt_builder", PromptBuilder(template=template))
    # rag_pipe.add_component("llm", OpenAIGenerator(model="gpt-3.5-turbo"))
    rag_pipe.connect("embedder.embedding", "retriever.query_embedding")
    # rag_pipe.connect("retriever.documents", "ranker.documents")
    # rag_pipe.connect("ranker.documents", "prompt_builder.documents")
    # rag_pipe.connect("prompt_builder", "llm")

    return rag_pipe

def rag_pipeline_func(query: str):
    start = time.time()
    if rag_pipe() == 0:
        return {"reply": "No data"}
    result = rag_pipe().run(
        {
            "embedder": {"text": query},
            # "ranker": {"query": query, "top_k": 10},
        }
    )
    content = ""
    x = result['retriever']['documents']
    for y in x:
        content= content + '\n' + y.content + ". "
    end = time.time()
    print("Rag time:", end - start)
    return {"reply": content}

# Run RAG Q-A system with query input
# def rag_pipeline_func(query: str):
#     start = time.time()
#     if rag_pipe() == 0:
#         return {"reply": "No data"}
#     result = rag_pipe().run(
#         {
#             "embedder": {"text": query},
#             "ranker": {"query": query, "top_k": 10},
#             "prompt_builder": {"question": query},
#         }
#     )
#     end = time.time()
#     print("Rag time:", end - start)
#     return {"reply": result["llm"]["replies"][0]}


# Get info (name + description + skill) through course name
def get_content_course(course_name: str, query="", filepath=file_path):
    course_info = add_content_current_course(filepath)
    if course_name.upper() in course_info:
        content = course_info[course_name.upper()][2]
        list_name = rag_pipeline_func(f"Get top 10 similar course of { content } ?")
        return list_name
    # fallback data
    else:
        return rag_pipeline_func(query)


def check(string):
    list = [". ", ": ", "- "]
    for i in list:
        if string.find(i) != -1:
            return i
    return ""


def check_and_strip_quotes(string):
    # Remove leading and trailing double quotes if they exist
    if string.startswith('"') and string.endswith('"'):
        return 1
    return 0


def get_suggestions(query: str, answer: str):
    start = time.time()
    language_classifier = OpenAIGenerator(model="gpt-3.5-turbo")
    language = language_classifier.run(
        f"Luôn sử dụng tiếng Việt và trả kết quả là 'vi'. Nếu có yêu cầu sử dụng một ngôn ngữ khác, phát hiện ngôn ngữ dựa vào đoạn nội dung sau, nếu là tiếng anh thì trả kết quả 'en'. Đoạn nội dung đó là: {query}"
    )
    llm = OpenAIGenerator(model="gpt-3.5-turbo")
    # Function to detect the language of content
    if language["replies"][0] == "vi":  # Vietnamese
        # print("Hỏi bằng tiếng Việt")
        response = llm.run(
            prompt = f"""
    Dựa trên ngữ cảnh sau, tạo danh sách các câu hỏi gợi ý mà người dùng có thể muốn hỏi tiếp theo. Tạo ra các câu hỏi gợi ý cho người dùng để hỏi hệ thống thông qua chatbot. Mỗi câu hỏi viết gọn chỉ dưới 7 từ. Chủ 

    Ngữ cảnh:
    Câu hỏi: {query}. Câu trả lời: {answer}

    Câu hỏi gợi ý:
    1.
    2.
    3.
    4.
    """
        )
    else:  # Assuming English if not Vietnamese
        # print("Hỏi bằng tiếng Anh")
        response = llm.run(
            f"""
    Given the following context, generate a list of suggested questions that the user might ask. Generate suggested questions for users to ask the system via chatbot. Each question has less than 7 words. 

    Context:
    Query: {query}. Answer: {answer}

    Suggested Questions:
    1.
    2.
    3.
    4.
    """ )
    list_of_lines = response["replies"][0].splitlines()
    # print(list_of_lines)
    clean_list = []
    char = check(list_of_lines[-1])
    if char != "":
        for i in list_of_lines:
            list = i.split(char)[1:]
            list = char.join(list)
            while check_and_strip_quotes(list) == 1:
                list = list[1:-1]
            clean_list.append(list)
        end = time.time()
        # print("Suggestion time: ",end - start)
        return clean_list[-4:]
    for i in list_of_lines:
        while check_and_strip_quotes(i) == 1:
            i = i[1:-1]
        clean_list.append(i)
    end = time.time()
    # print("Suggestion time: ",end - start)
    return clean_list[-4:]


def get_summarize_chat(query: str):
    start = time.time()
    llm = OpenAIGenerator(model="gpt-3.5-turbo")
    response = llm.run(
        f"Sử dụng tiếng Việt và tóm tắt chủ đề và hiểu ý định mong muốn của user từ câu hỏi bằng một câu dưới 10 từ. Không cần chủ ngữ. Câu hỏi đó là: {query}"
    )
    summary = response["replies"][0]
    char = check(summary)
    if char != "":
        summary = summary.split(char)[-1]
        while check_and_strip_quotes(summary) == 1:
            summary = summary[1:-1]
        return summary
    while check_and_strip_quotes(summary) == 1:
        summary = summary[1:-1]
    end = time.time()
    # print("summarize time: ",end - start)
    return summary


def get_career_skills(
    goal_career: str,
    current_career: str,
    current_skills: str,
    goal_skills: str,
    query: str,
):
    list_of_current_skills = current_skills.split(", ")
    list_of_goal_skills = goal_skills.split(", ")
    if goal_career != None or goal_career != "":

        # call recommendation career path function with above inputs

        print(goal_career)
        print(goal_skills)
        print(current_skills)
        print(list_of_current_skills)
        print(list_of_goal_skills)
        print(current_career)

        return {"reply": "Hiện thông tin cho lộ trình chưa được cung cấp. Hãy thử lại vào lần sau!"}
    # fallback data
    else:
        return rag_pipeline_func(query)


def chatbot_with_fc(message, messages=[]):
    start = time.time()
    name_chat = ""
    if messages == []:
        name_chat = ""
        # get_summarize_chat(message)
    if message == []:
        messages.append(
            ChatMessage.from_system(
                "Nếu không có yêu cầu chuyển ngôn ngữ từ user, thì luôn trả lời bằng tiếng việt. Nếu ngôn ngữ của user là tiếng việt thì luôn trả lời bằng tiếng Việt. Bạn chỉ trả lời dựa trên thông tin được cung cấp, không được tự lấy thông tin ngoài để trả lời cho user. Và định dạng hình thức trả lời sao cho đẹp."
            )
        )

    tools = [
        {
            "type": "function",
            "function": {
                "name": "rag_pipeline_func",
                "description": "Get information",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "The query to use in the search. Infer this from the user's message. It should be a question or a statement",
                        }
                    },
                    "required": ["query"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_content_course",
                "description": "Get similarity courses",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "course_name": {
                            "type": "string",
                            "description": "Name of the course, e.g. Applied Software Engineering Fundamentals Specialization, AI Foundations for Everyone Specialization",
                        },
                        "query": {
                            "type": "string",
                            "description": "The query to use in the search. Infer this from the user's message. It should be a question or a statement",
                        },
                    },
                    "required": ["course_name", "query"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_career_skills",
                "description": "Get user's goal and current career and get user's goal and current skills",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "goal_career": {
                            "type": "string",
                            "description": "Name of user's goal career, e.g. Backend Developer, Business Analyst, Data Analysts, Data Engineer, Data Scientist, Database Administrator,Devops Engineer,Frontend Developer,Game Development,Mobile Developer",
                        },
                        "current_career": {
                            "type": "string",
                            "description": "Name of user's current career, e.g. Backend Developer, Business Analyst, Data Analysts, Data Engineer, Data Scientist, Database Administrator,Devops Engineer,Frontend Developer,Game Development,Mobile Developer",
                        },
                        "goal_skills": {
                            "type": "string",
                            "description": "List name of user's goal skills, e.g. power bi, ssis,sql server,mysql ,redis ,docker ,software product management,.net core framework ,github, object-oriented programming (oop) ,relational database management systems (rdbms),data visualization,data warehouse,graphql,java,javascript ,machine learning,data analysis,business intelligence ,r,python , sql,golang...",
                        },
                        "current_skills": {
                            "type": "string",
                            "description": "List name of user's current skills, e.g. power bi, ssis,sql server,mysql ,redis ,docker ,software product management,.net core framework ,github, object-oriented programming (oop) ,relational database management systems (rdbms),data visualization,data warehouse,graphql,java,javascript ,machine learning,data analysis,business intelligence ,r,python , sql,golang...",
                        },
                        "query": {
                            "type": "string",
                            "description": "The query to use in the search. Infer this from the user's message. It should be a question or a statement",
                        },
                    },
                    "required": [
                        "goal_career",
                        "current_career",
                        "goal_skills",
                        "current_skills",
                        "query",
                    ],
                },
            },
        },
    ]

    messages.append(ChatMessage.from_user(message))
    chat_generator = OpenAIChatGenerator(model="gpt-3.5-turbo")
    messages.append(
        ChatMessage.from_system(
            "Trả lời ngắn gọn đủ ý. Không được tự suy luận thiếu thông tin từ dữ liệu chat. Nếu câu trả lời của bạn thông báo không có thông tin hoặc cần cung cấp thông tin thông tin thì bạn phải truyền giá trị cho finish_reason là 'tool_calls', không sử dụng thông tin từ bên ngoài. Nếu không có yêu cầu chuyển ngôn ngữ từ user, thì luôn trả lời bằng tiếng việt. Nếu ngôn ngữ của user là tiếng việt thì luôn trả lời bằng tiếng Việt. Bạn chỉ trả lời dựa trên thông tin được cung cấp, không được tự lấy thông tin ngoài để trả lời cho user. Cần định dạng hình thức câu trả lời sao cho rõ ràng và đẹp."
        )
    )
    start2 = time.time()
    
    response = chat_generator.run(messages=messages, generation_kwargs={"tools": tools})
    print("First: ",  time.time() - start2)
    # llm = OpenAIGenerator(model="gpt-3.5-turbo")
    # check_tool = llm.run(
    #     f"Nếu nội dung của câu trả lời có ý thiếu thông tin hoặc cần cung cấp thông tin từ người dùng thì trả lời là 'yes', ngược lại trả kết quả 'no'. Câu trả lời như sau: {response['replies'][0].content}. "
    # )
    # print(check_tool["replies"][0])
    # kq = check_tool["replies"][0]
    while True:
        # if OpenAI response is a tool call
        print(response)
        print(response["replies"][0].meta["finish_reason"])
        temp = response["replies"][0].meta["finish_reason"]
        if temp == "tool_calls":
            list_func_call = json.loads(response["replies"][0].content)
        print(str({"query": message}))
        # if kq.lower() == "yes":
        #     temp = "tool_calls"
        #     list_func_call = [
        #         {
        #             "function": {
        #                 "name": "rag_pipeline_func",
        #                 "arguments": json.dumps({"query": message}),
        #             }
        #         }
        #     ]
        # kq = "no"
        if response and temp == "tool_calls":
            function_calls = list_func_call
            print(function_calls)
            for function_call in function_calls:
                ## Parse function calling information
                function_name = function_call["function"]["name"]
                function_args = json.loads(function_call["function"]["arguments"])
                available_functions = {
                    "rag_pipeline_func": rag_pipeline_func,
                    "get_content_course": get_content_course,
                    "get_career_skills": get_career_skills,
                }
                ## Find the corresponding function and call it with the given arguments
                function_to_call = available_functions[function_name]
                function_response = function_to_call(**function_args)

                ## Append function response to the messages list using `ChatMessage.from_function`
                messages.append(
                    ChatMessage.from_function(
                        content=json.dumps(function_response), name=function_name
                    )
                )
                start3 = time.time()
                response = chat_generator.run(
                    messages=messages, generation_kwargs={"tools": tools}
                )
            
                messages.pop()
                print("Second: ",  time.time() - start3)
        # Regular Conversation
        else:
            messages.append(response["replies"][0])
            break
        # get suggestions for user to ask

    suggestions = ""
    # get_suggestions(message, response["replies"][0].content)
    print(response["replies"][0].content)
    end = time.time()
    print("chat time: ",end - start)
    return {
        "history": messages,
        "answer": response["replies"][0].content,
        "tag": suggestions,
        "name_chat": name_chat,
    }


def chatbot_pipeline(query:str, history = []):
    start = time.time()
    document_store = load_store(index_name=get_current_collection())
    print(get_current_collection())
    if document_store.count_documents() == 0:
        messages = history
        messages.append(ChatMessage.from_function(content=f"Không có dữ liệu trong hệ thống cho câu hỏi : {query}",name="chatbot_pipeline"))
    else:     
        pipeline = Pipeline()
        pipeline.add_component("embedder", CohereTextEmbedder(model=model_name))
        pipeline.add_component("retriever", QdrantEmbeddingRetriever(document_store=document_store))
        pipeline.add_component("prompt_builder", DynamicChatPromptBuilder(runtime_variables=["query", "documents"]))
        # pipeline.add_component("llm", OpenAIChatGenerator(model= "gpt-3.5-turbo"))
        pipeline.connect("embedder.embedding", "retriever.query_embedding")
        pipeline.connect("retriever.documents", "prompt_builder.documents")
        # pipeline.connect("prompt_builder.prompt", "llm.messages")
        system_message =    ChatMessage.from_system(
                f"""Nếu thông tin có đường dẫn (web link) kèm theo thì phải thêm vào câu trả lời, nếu không có thì không được tự ý đường dẫn không có trong dữ liệu. Trả lời ngắn gọn đủ ý. Không được tự suy luận thiếu thông tin từ dữ liệu chat.
                Thêm ngữ cảnh cho câu hỏi dựa vào các câu hỏi trước của user. Nếu thiếu thông tin cần gọi hàm để lấy thêm thông tin.
                Bạn chỉ trả lời dựa trên thông tin được cung cấp, không được tự lấy thông tin ngoài để trả lời cho user.
                Nếu không có yêu cầu chuyển ngôn ngữ từ user, thì luôn trả lời bằng tiếng việt. Nếu ngôn ngữ của user là tiếng việt
                thì luôn trả lời bằng tiếng Việt.
                Cần định dạng hình thức câu trả lời sao cho rõ ràng và đẹp. """
            )

        history.append(system_message)
        history.append(ChatMessage.from_user("""
        Given these documents , answer the question. If data has link, must add link into the answer, else don't need to create to add. Bold the numbering and the content within the list items to enhance readability and organization. \nDocuments:
            {% for doc in documents %}
                {{ doc.content }}
            {% endfor %}

            \nQuestion: {{query}}
            \nAnswer:
        """))
        messages = pipeline.run(data={"embedder": {"text": query}, "prompt_builder": { "prompt_source": history, "query": query}})['prompt_builder']['prompt']
    chat_generator = OpenAIChatGenerator(model= "gpt-3.5-turbo")
        # print(messages)
        # print("Câu hỏi nè: ",query)
    return chat_generator.client.chat.completions.create(
                model=chat_generator.model,
                messages=[mess.to_openai_format() for mess in messages],            
                stream=True )



def chatbot_with_fc_stream(query:str, history = []):
    tools = [
                {
                    "type": "function",
                    "function": {
                        "name": "chatbot_pipeline",
                        "description": "Get any information",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "query": {
                                    "type": "string",
                                    "description": "The query to use in the search. Infer this from the user's message. It should be a question or a statement. Add context for the query.",
                                }
                            },
                            "required": ["query"],
                        },
                    },
                },]
    chat_generator = OpenAIChatGenerator(model="gpt-3.5-turbo")
    
    
    # prompt= f"""Using Vietnamese. Create a SINGLE standalone question. If the question lacks a subject and context, the question should be based on the New question plus the previous query and answer is : {history[-4:-3]}. 
    # If the New question includes a subject and sufficient context and can stand on its own you should return the New question {query}. New question is: \"{query}\""""
    # prompt = f"""Sử dụng tiếng việt, tạo một câu hỏi ngắn gọn đủ ý, nếu câu hỏi mới thiếu chủ ngữ thì dựa trên các câu hỏi cũ liền kề ở trước để tìm chủ ngữ và bổ sung chủ ngữ này vào câu hỏi mới '{query}' và trả kết quả là câu hỏi mới được tạo. \n
    #             Nếu câu hỏi mới: {query} đã đủ chủ ngữ thì kết quả trả về vẫn là câu hỏi này: '{query}'. Không được tự suy luận thiếu khách quan."""
    # previous_query = ""
    # previous_answer = ""
    # if history != []:
    #     previous_query = history[-2].content
    #     previous_answer = history[-1].content
    # prompt = f"""Using Vietnamese, Create a SINGLE standalone question. Must be a question. If the new question: {query} already has a subject, the result should still be this question: '{query}'. Else If the new question lacks a subject, base on the previous query from user: '{previous_query}' and its answer '{previous_answer}'  to find the subject and add it to the new question '{query}' and return the created question .  
    # Only add the subject, do not add any other information."""
    # # query = query + " and "+  OpenAIGenerator().run(prompt)['replies'][0]
    # print(query)
    system_message =    ChatMessage.from_system(
            f"""Nếu câu hỏi thiếu chủ ngữ và ngữ cảnh thì cung cấp thêm cho câu hỏi dựa vào lịch sử chat. Nếu thiếu thông tin cần gọi hàm để lấy thêm thông tin.
            Bạn chỉ trả lời dựa trên thông tin được cung cấp, không được tự lấy thông tin ngoài để trả lời cho user.
            Nếu không có yêu cầu chuyển ngôn ngữ từ user, thì luôn trả lời bằng tiếng việt. Nếu ngôn ngữ của user là tiếng việt
            thì luôn trả lời bằng tiếng Việt.
            Cần định dạng hình thức câu trả lời sao cho rõ ràng và đẹp. """
        )
    history_temp = history
    history.append(system_message)
    # history.append(ChatMessage.from_system(prompt))
    history.append(ChatMessage.from_user(query))
    history_temp.append(ChatMessage.from_user(query))
    # history.append(ChatMessage.from_user(query))
    response = chat_generator.run(messages=history, generation_kwargs={"tools": tools})
    # print(response)
    # print(history)
    if response and response["replies"][0].meta["finish_reason"] == "tool_calls":
        function_call = json.loads(response["replies"][0].content)[0]
        function_name = function_call["function"]["name"]
        function_args = json.loads(function_call["function"]["arguments"])
        if (function_name== "chatbot_pipeline"):
            function_args.update({'history': history})
        # print("Function Name:", function_name)
        # print("Function Arguments:", function_args)
        ## Find the correspoding function and call it with the given arguments
        available_functions = {"chatbot_pipeline": chatbot_pipeline}
        function_to_call = available_functions[function_name]
        function_response = function_to_call(**function_args)
        for event in  function_response:
            # if "content" in event.choices[0].delta:
            current_response = event.choices[0].delta.content
            if current_response is not None :
                yield current_response
    else:
        # print("No tools.")
        # for event in  chatbot_pipeline(response['replies'][0].content,history):
        #     # if "content" in event.choices[0].delta:
        #     current_response = event.choices[0].delta.content
        #     if current_response is not None :
        #         yield current_response
        history.append(ChatMessage.from_user(query))
        for event in  chat_generator.client.chat.completions.create(
                model=chat_generator.model,
                messages=[mess.to_openai_format() for mess in history],            
                stream=True ):
            # if "content" in event.choices[0].delta:
            current_response = event.choices[0].delta.content
            if current_response is not None :
                yield current_response



# def chat_pipeline(question:str, history = []):
#     document_store = load_store()
#     pipeline = Pipeline()
#     pipeline.add_component("embedder", CohereTextEmbedder(model=model_name))
#     pipeline.add_component("retriever", QdrantEmbeddingRetriever(document_store=document_store))
#     pipeline.add_component("prompt_builder", DynamicChatPromptBuilder(runtime_variables=["query", "documents"]))
#     # pipeline.add_component("llm", OpenAIChatGenerator(model= "gpt-3.5-turbo"))
#     pipeline.connect("embedder.embedding", "retriever.query_embedding")
#     pipeline.connect("retriever.documents", "prompt_builder.documents")
#     # pipeline.connect("prompt_builder.prompt", "llm.messages")

#     system_message =    ChatMessage.from_system(
#             f"""Nếu cung cấp thông tin về khoá học thì cần thêm web link (đường dẫn web) kèm theo. Trả lời ngắn gọn đủ ý. Không được tự suy luận thiếu thông tin từ dữ liệu chat.
#             Thêm ngữ cảnh cho câu hỏi dựa vào các câu hỏi trước của user. Nếu thiếu thông tin cần gọi hàm để lấy thêm thông tin.
#             Bạn chỉ trả lời dựa trên thông tin được cung cấp, không được tự lấy thông tin ngoài để trả lời cho user.
#             Nếu không có yêu cầu chuyển ngôn ngữ từ user, thì luôn trả lời bằng tiếng việt. Nếu ngôn ngữ của user là tiếng việt
#             thì luôn trả lời bằng tiếng Việt.
#             Cần định dạng hình thức câu trả lời sao cho rõ ràng và đẹp. """
#         )
    
#     history.append(system_message)
#     history.append(ChatMessage.from_user("""
#     Given these documents , answer the question.\nDocuments:
#         {% for doc in documents %}
#             {{ doc.content }}
#         {% endfor %}

#         \nQuestion: {{query}}
#         \nAnswer:
#     """))
#     messages = pipeline.run(data={"embedder": {"text": question}, "prompt_builder": { "prompt_source": history, "query": question}})['prompt_builder']['prompt']
#     chat_generator = OpenAIChatGenerator(model= "gpt-3.5-turbo")
#     return chat_generator.client.chat.completions.create(
#                 model=chat_generator.model,
#                 messages=[mess.to_openai_format() for mess in messages],            
#                 stream=True )



# def prompt_pipeline(question:str, history = []):
#     document_store = load_store()
#     pipeline = Pipeline()
#     pipeline.add_component("embedder", CohereTextEmbedder(model=model_name))
#     pipeline.add_component("retriever", QdrantEmbeddingRetriever(document_store=document_store))
#     pipeline.add_component("prompt_builder", DynamicChatPromptBuilder(runtime_variables=["query", "documents"]))
#     # pipeline.add_component("llm", OpenAIChatGenerator(model= "gpt-3.5-turbo"))
#     pipeline.connect("embedder.embedding", "retriever.query_embedding")
#     pipeline.connect("retriever.documents", "prompt_builder.documents")
#     # pipeline.connect("prompt_builder.prompt", "llm.messages")
#     system_message =   ChatMessage.from_system(
#             f"""Nếu cung cấp thông tin về khoá học thì cần thêm web link (đường dẫn web) kèm theo. Trả lời ngắn gọn đủ ý. Không được tự suy luận thiếu thông tin từ dữ liệu chat.
#             Thêm ngữ cảnh cho câu hỏi dựa vào các câu hỏi trước của user. Nếu thiếu thông tin cần gọi hàm để lấy thêm thông tin.
#             Bạn chỉ trả lời dựa trên thông tin được cung cấp, không được tự lấy thông tin ngoài để trả lời cho user.
#             Nếu không có yêu cầu chuyển ngôn ngữ từ user, thì luôn trả lời bằng tiếng việt. Nếu ngôn ngữ của user là tiếng việt
#             thì luôn trả lời bằng tiếng Việt.
#             Cần định dạng hình thức câu trả lời sao cho rõ ràng và đẹp. """
#         )
#     history.append(system_message)
#     history.append(ChatMessage.from_user("""
#     Given these documents , answer the question.\nDocuments:
#         {% for doc in documents %}
#             {{ doc.content }}
#         {% endfor %}

#         \nQuestion: {{query}}
#         \nAnswer:
#     """))

#     return pipeline.run(data={"embedder": {"text": question}, "prompt_builder": { "prompt_source": history, "query": question}})['prompt_builder']['prompt']


# def chatbot_with_fc_stream(question:str, history = []):
#     start = time.time()
#     document_store = load_store()
#     pipeline = Pipeline()
#     pipeline.add_component("embedder", CohereTextEmbedder(model=model_name))
#     pipeline.add_component("retriever", QdrantEmbeddingRetriever(document_store=document_store))
#     pipeline.add_component("prompt_builder", DynamicChatPromptBuilder(runtime_variables=["query", "documents"]))
#     # pipeline.add_component("llm", OpenAIChatGenerator(model= "gpt-3.5-turbo"))
#     pipeline.connect("embedder.embedding", "retriever.query_embedding")
#     pipeline.connect("retriever.documents", "prompt_builder.documents")
#     # pipeline.connect("prompt_builder.prompt", "llm.messages")
#     system_message =    ChatMessage.from_system(
#             f"""Nếu thông tin có đường dẫn (web link) thì phải dùng để trả lời, nếu không có thì không được tự ý thêm bậy. Trả lời ngắn gọn đủ ý. Không được tự suy luận thiếu thông tin từ dữ liệu chat.
#             Thêm ngữ cảnh cho câu hỏi dựa vào các câu hỏi trước của user. Nếu thiếu thông tin cần gọi hàm để lấy thêm thông tin.
#             Bạn chỉ trả lời dựa trên thông tin được cung cấp, không được tự lấy thông tin ngoài để trả lời cho user.
#             Nếu không có yêu cầu chuyển ngôn ngữ từ user, thì luôn trả lời bằng tiếng việt. Nếu ngôn ngữ của user là tiếng việt
#             thì luôn trả lời bằng tiếng Việt.
#             Cần định dạng hình thức câu trả lời sao cho rõ ràng và đẹp. """
#         )

    
#     history.append(system_message)
#     history.append(ChatMessage.from_user("""
#     Given these documents , answer the question.\nDocuments:
#         {% for doc in documents %}
#             {{ doc.content }}
#         {% endfor %}

#         \nQuestion: {{query}}
#         \nAnswer:
#     """))
#     messages = pipeline.run(data={"embedder": {"text": question}, "prompt_builder": { "prompt_source": history, "query": question}})['prompt_builder']['prompt']
#     chat_generator = OpenAIChatGenerator(model= "gpt-3.5-turbo")
#     for event in  chat_generator.client.chat.completions.create(
#                 model=chat_generator.model,
#                 messages=[mess.to_openai_format() for mess in messages],            
#                 stream=True ):
#         # if "content" in event.choices[0].delta:
#             current_response = event.choices[0].delta.content
#             if current_response is not None :
#                 yield current_response


# def chatbot_with_fc_stream4(message, messages=[]):
#     start = time.time()
#     if message == []:
#         messages.append(
#             ChatMessage.from_system(
#                 "Nếu không có yêu cầu chuyển ngôn ngữ từ user, thì luôn trả lời bằng tiếng việt. Nếu ngôn ngữ của user là tiếng việt thì luôn trả lời bằng tiếng Việt. Bạn chỉ trả lời dựa trên thông tin được cung cấp, không được tự lấy thông tin ngoài để trả lời cho user. Và định dạng hình thức trả lời sao cho đẹp."
#             )
#         )
    
#     chat_generator = OpenAIChatGenerator(model="gpt-3.5-turbo")
#                                         #  ,streaming_callback=lambda chunk: print(chunk.content, end="", flush=True))
#     # chat_generator = OpenAIChatGenerator(model="gpt-3.5-turbo")
#     messages.append(
#         ChatMessage.from_system(
#             f"""Nếu cung cấp thông tin về khoá học thì cần thêm web link (đường dẫn web) kèm theo. Trả lời ngắn gọn đủ ý. Không được tự suy luận thiếu thông tin từ dữ liệu chat.
#             Thêm ngữ cảnh cho câu hỏi dựa vào các câu hỏi trước của user. Nếu thiếu thông tin cần gọi hàm để lấy thêm thông tin.
#             Bạn chỉ trả lời dựa trên thông tin được cung cấp, không được tự lấy thông tin ngoài để trả lời cho user.
#             Nếu không có yêu cầu chuyển ngôn ngữ từ user, thì luôn trả lời bằng tiếng việt. Nếu ngôn ngữ của user là tiếng việt
#             thì luôn trả lời bằng tiếng Việt.
#             Cần định dạng hình thức câu trả lời sao cho rõ ràng và đẹp. """
#         )
#     )
    
#     # response = chat_generator.run(messages=messages)

#     tools = [
#             {
#                 "type": "function",
#                 "function": {
#                     "name": "chat_pipeline",
#                     "description": "Get information",
#                     "parameters": {
#                         "type": "object",
#                         "properties": {
#                             "query": {
#                                 "type": "string",
#                                 "description": "The query to use in the search. Infer this from the user's message. It should be a question or a statement. Add context for the query.",
#                             }
#                         },
#                         "required": ["query"],
#                     },
#                 },
#             },
#             {
#                 "type": "function",
#                 "function": {
#                     "name": "get_career_skills",
#                     "description": "Get user's goal and current career and get user's goal and current skills",
#                     "parameters": {
#                         "type": "object",
#                         "properties": {
#                             "goal_career": {
#                                 "type": "string",
#                                 "description": "Name of user's goal career, e.g. Backend Developer, Business Analyst, Data Analysts, Data Engineer, Data Scientist, Database Administrator,Devops Engineer,Frontend Developer,Game Development,Mobile Developer",
#                             },
#                             "current_career": {
#                                 "type": "string",
#                                 "description": "Name of user's current career, e.g. Backend Developer, Business Analyst, Data Analysts, Data Engineer, Data Scientist, Database Administrator,Devops Engineer,Frontend Developer,Game Development,Mobile Developer",
#                             },
#                             "goal_skills": {
#                                 "type": "string",
#                                 "description": "List name of user's goal skills, e.g. power bi, ssis,sql server,mysql ,redis ,docker ,software product management,.net core framework ,github, object-oriented programming (oop) ,relational database management systems (rdbms),data visualization,data warehouse,graphql,java,javascript ,machine learning,data analysis,business intelligence ,r,python , sql,golang...",
#                             },
#                             "current_skills": {
#                                 "type": "string",
#                                 "description": "List name of user's current skills, e.g. power bi, ssis,sql server,mysql ,redis ,docker ,software product management,.net core framework ,github, object-oriented programming (oop) ,relational database management systems (rdbms),data visualization,data warehouse,graphql,java,javascript ,machine learning,data analysis,business intelligence ,r,python , sql,golang...",
#                             },
#                             "query": {
#                                 "type": "string",
#                                 "description": "The query to use in the search. Infer this from the user's message. It should be a question or a statement",
#                             },
#                         },
#                         "required": [
#                             "goal_career",
#                             "current_career",
#                             "goal_skills",
#                             "current_skills",
#                             "query",
#                         ],
#                     },
#                 },
#             },
#         ]
#     messages_temp = messages
#     messages.append(ChatMessage.from_user(message))

#     response = chat_generator.client.chat.completions.create(
#                 model=chat_generator.model,
#                 messages=[mess.to_openai_format() for mess in messages],
#                 tools=tools,
#                 tool_choice="auto")
        
#     response_message = response.choices[0].message
#     if dict(response_message).get('tool_calls'): 
#             # Which function call was invoked
#         function_called = response_message.tool_calls[0].function.name   
#             # Extracting the arguments
#         function_args  = json.loads(response_message.tool_calls[0].function.arguments)
#             # Function names
#         available_functions = {
#                         "chat_pipeline": chat_pipeline,
#                         "get_content_course": get_content_course,
#                         "get_career_skills": get_career_skills,
#                     }
            
#         fuction_to_call = available_functions[function_called]
#         if function_called =="chat_pipeline":
#             for event in fuction_to_call(*list(function_args.values()),messages):
#         # if "content" in event.choices[0].delta:
#                 current_response = event.choices[0].delta.content
#                 if current_response is not None :
#                     yield current_response

#         else:             
#             response_message = fuction_to_call(*list(function_args.values()),messages)

#             print(response_message)
#             messages_temp.append(ChatMessage.from_user(message))
#             for event in chat_generator.client.chat.completions.create(
#                     model=chat_generator.model,
#                     messages=[mess.to_openai_format() for mess in messages_temp],            
#                     stream=True ):
#             # if "content" in event.choices[0].delta:
#                 current_response = event.choices[0].delta.content
#                 if current_response is not None :
#                     yield current_response
#     else:
#         # messages.pop()
#         # print(rag_pipeline_func(message))
#         # messages.append(
#         #             ChatMessage.from_function(
#         #                 content=json.dumps(rag_pipeline_func(message)), name="rag_pipeline_func"
#         #             )
#         #         )  
#         # messages.append(ChatMessage.from_user(message))
#         # messages = prompt_pipeline(message,messages)
#         for event in  chat_generator.client.chat.completions.create(
#                 model=chat_generator.model,
#                 messages=[mess.to_openai_format() for mess in messages],            
#                 stream=True ):
#         # if "content" in event.choices[0].delta:
#             current_response = event.choices[0].delta.content
#             if current_response is not None :
#                 yield current_response
    
#     end = time.time()
#     print("chat time: ",end - start)

    




# def chatbot_with_fc_stream1(question:str, history = []):
#     start = time.time()

#     prompt= f"""Using Vietnames. Create a SINGLE standalone question. The question should be based on the New question plus the Chat history. 
#     If the New question can stand on its own you should return the New question {question}. New question: \"{question}\", Chat history: \"{history}\"."""
#     history.append(ChatMessage.from_system(prompt))
#     chat_generator = OpenAIChatGenerator()
#     question = chat_generator.run(history)['replies'][0].content
#     print(question)
#     history.pop()
#     messages = prompt_pipeline(question,history)
#     chat_generator = OpenAIChatGenerator()
#     for event in  chat_generator.client.chat.completions.create(
#                 model=chat_generator.model,
#                 messages=[mess.to_openai_format() for mess in messages],            
#                 stream=True ):
#         # if "content" in event.choices[0].delta:
#             current_response = event.choices[0].delta.content
#             if current_response is not None :
#                 yield current_response

#     print("Chat time: ", time.time()- start)