from .core.functions import chatbot_with_fc


def get_chat_result(text, history=[]):
    result = chatbot_with_fc(text, history)
    return {"response": result}
