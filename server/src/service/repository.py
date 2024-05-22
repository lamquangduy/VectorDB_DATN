from .core.functions import chatbot_with_fc
from haystack.dataclasses import ChatMessage

def get_chat_result(text, history=[]):
    result = chatbot_with_fc(text, history)
    return {"response": result}

def dict_2_messages(history = []):
    messages = []
    for n in history:
        if(n["role"] == "system"):
            messages.append(ChatMessage.from_system(n["content"]))
        elif n["role"] == "user":
            messages.append(ChatMessage.from_user(n["content"]))
        elif n["role"] == "function":
            messages.append(ChatMessage.from_function(content=n["content"],name=n["name"]))
        else:
            messages.append(ChatMessage.from_assistant(n["content"]))
    return messages