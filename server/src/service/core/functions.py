# pip uninstall -y farm-haystack haystack-ai
# pip install haystack-ai
# pip install qdrant-haystack
# pip install "sentence-transformers>=2.2.0"
#

import os
import json
from src.database.mongodb.repository import mongo_client

# import gradio as gr
import pandas as pd
from haystack.document_stores.types import DuplicatePolicy
from haystack import Pipeline
from haystack.components.embedders import (
    SentenceTransformersTextEmbedder,
    SentenceTransformersDocumentEmbedder,
)
from haystack.components.classifiers import DocumentLanguageClassifier
from haystack.components.builders import PromptBuilder
from haystack.components.generators import OpenAIGenerator
from haystack.dataclasses import ChatMessage, StreamingChunk
from haystack.components.generators.chat import OpenAIChatGenerator
from haystack.components.generators.utils import print_streaming_chunk
from haystack import Document

# from load_documentstore import load_store
from haystack.dataclasses import ChatMessage
from haystack.components.generators.chat import OpenAIChatGenerator
from haystack_integrations.components.retrievers.qdrant import QdrantEmbeddingRetriever
from haystack.utils import Secret
from haystack_integrations.document_stores.qdrant import QdrantDocumentStore
import time
from haystack_integrations.components.rankers.cohere import CohereRanker
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
        url=url_cloud,
        api_key=api_key,
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
        url=url,
        api_key=Secret.from_token(token=token),
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
        content= content + y.content + ". "
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
        f"Luôn sử dụng tiếng Việt và trả kết quả là 'vi'. Nếu có yêu cầu sử dụng một ngôn ngữ khác, cần phát hiện ngôn ngữ cho đoạn nội dung sau và trả kết quả hoặc là 'vi' hoặc là 'en'. Đoạn nội dung đó là: {query}"
    )
    llm = OpenAIGenerator(model="gpt-3.5-turbo")
    # Function to detect the language of content
    if language["replies"][0] == "vi":  # Vietnamese
        print("Hỏi bằng tiếng Việt")
        response = llm.run(
            f"Bạn là một người dùng. Mục đích của bạn là tạo các câu hỏi liên quan đến một khóa học hoặc các khóa học tương tự được đề cập trong câu truy vấn phải bằng tiếng Việt, để hỏi người khác. Nếu câu truy vấn đề cập đến mục tiêu nghề nghiệp của bạn, mục đích của bạn là tạo các câu hỏi liên quan đến các khóa học phù hợp với mong muốn của bạn. Bạn có thể sử dụng câu hỏi mở (nên liên quan đến khóa học lập trình trực tuyến) nếu nội dung không có ích. Cung cấp 4 câu hỏi, mỗi câu hỏi phải ít hơn 7 từ (càng ngắn càng tốt), chỉ văn bản. Không định dạng với dấu đạn hay số. Dựa trên nội dung này: Câu hỏi: {query}. Đáp án: {answer}"
        )
    else:  # Assuming English if not Vietnamese
        print("Hỏi bằng tiếng Anh")
        response = llm.run(
            f"You are an user. Your purpose is to create your questions relative with a course or similarity courses which are mentioned in query, to ask anothers, and if query mention your's goal career which is mentioned in query, your purpose is to create your questions relative with course that fits your desire. You can use open questions (these should relate to online programming course) if the content isn't helpful. Provide 4 questions, each question must be less than 7 words (as short as possible), only text. Do not format with bullets or numbers. Base your questions on this content:  Query: {query}. Answer: {answer}"
        )
    list_of_lines = response["replies"][0].splitlines()
    clean_list = []
    char = check(list_of_lines[-1])
    if char != "":
        for i in list_of_lines:
            list = i.split(char)[-1]
            while check_and_strip_quotes(list) == 1:
                list = list[1:-1]
            clean_list.append(list)
        end = time.time()
        print("Suggestion time: ",end - start)
        return clean_list[-4:]
    for i in list_of_lines:
        while check_and_strip_quotes(i) == 1:
            i = i[1:-1]
        clean_list.append(i)
    end = time.time()
    print("Suggestion time: ",end - start)
    return clean_list[-4:]


def get_summarize_chat(query: str):
    start = time.time()
    llm = OpenAIGenerator(model="gpt-3.5-turbo")
    response = llm.run(
        f"Sử dụng tiếng Việt và tóm tắt nội dung bằng một câu dưới 10 từ của nội dung sau {query}"
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
    print("summarize time: ",end - start)
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

        return {"reply": "Data from fucntions"}
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


def chatbot_with_fc_stream(message, messages=[]):
    start = time.time()
    name_chat = ""
    if message == []:
        messages.append(
            ChatMessage.from_system(
                "Nếu không có yêu cầu chuyển ngôn ngữ từ user, thì luôn trả lời bằng tiếng việt. Nếu ngôn ngữ của user là tiếng việt thì luôn trả lời bằng tiếng Việt. Bạn chỉ trả lời dựa trên thông tin được cung cấp, không được tự lấy thông tin ngoài để trả lời cho user. Và định dạng hình thức trả lời sao cho đẹp."
            )
        )
    
    chat_generator = OpenAIChatGenerator(model="gpt-3.5-turbo")
                                        #  ,streaming_callback=lambda chunk: print(chunk.content, end="", flush=True))
    # chat_generator = OpenAIChatGenerator(model="gpt-3.5-turbo")
    messages.append(
        ChatMessage.from_system(
            f"""Trả lời ngắn gọn đủ ý. Không được tự suy luận thiếu thông tin từ dữ liệu chat.
            Nếu câu trả lời của bạn thông báo không có thông tin hoặc 
            cần cung cấp thông tin thông 
            tin thì bạn phải truyền giá trị cho finish_reason là 'tool_calls', không sử dụng thông tin từ bên ngoài. 
            Nếu không có yêu cầu chuyển ngôn ngữ từ user, thì luôn trả lời bằng tiếng việt. Nếu ngôn ngữ của user là tiếng việt
            thì luôn trả lời bằng tiếng Việt.
            Bạn chỉ trả lời dựa trên thông tin được cung cấp, không được tự lấy thông tin ngoài để trả lời cho user.
            Cần định dạng hình thức câu trả lời sao cho rõ ràng và đẹp. Nếu cung cấp thông tin về khoá học thì nên có thêm địa truy cập nếu có"""
        )
    )
    start2 = time.time()
    rag_result = rag_pipeline_func(message)
    print("Rag time: ", time.time() - start2)
    messages.append(
                    ChatMessage.from_function(
                        content=json.dumps(rag_result), name="rag_pipeline_func"
                    )
                )
    messages.append(ChatMessage.from_user(message))
    # response = chat_generator.run(messages=messages)
    end = time.time()
    print("chat time: ",end - start)
    
    
    for event in chat_generator.client.chat.completions.create(
            model=chat_generator.model,
            messages=[mess.to_openai_format() for mess in messages],
            stream=True
        ):
        # if "content" in event.choices[0].delta:
            current_response = event.choices[0].delta.content
            if current_response is not None :
                yield current_response
    
            
    # return {
    #     "history": messages,
    #     "answer": response["replies"][0].content,
    #     "tag": suggestions,
    #     "name_chat": name_chat,
    # }

# Test chatbot qua interface duoc support boi gradio
# def chatbot_interface():
#     response = None
#     messages = [
#         ChatMessage.from_system(
#             "Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous."
#         )
#     ]
#     cb = chatbot(messages, response)
#     demo = gr.ChatInterface(
#         fn=cb.chatbot_with_fc,
#         examples=[
#             "What is description of the course name IBM Applied DevOps Engineering Professional Certificate?",
#             "Which skills does the course name IBM Applied DevOps Engineering Professional Certificate have?",
#             "What are similarity courses of the course name whose is IBM Applied DevOps Engineering Professional Certificate?",
#         ],
#         title="Ask me about description or similar course!",
#     )
#     return demo


## Uncomment the line below to launch the chat app with UI
# chatbot_interface().launch()
