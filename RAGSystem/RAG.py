from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
import os


def load_document(file):
    import os
    name, extension = os.path.splitext(file)

    if extension == '.pdf':
        from langchain_community.document_loaders import PyPDFLoader
        print(f'Loading {file}')
        loader = PyPDFLoader(file)
    elif extension == '.docx':
        from langchain_community.document_loaders import Docx2txtLoader
        print(f'Loading{file}')
        loader = Docx2txtLoader(file)
    elif extension == '.txt':
        from langchain_community.document_loaders import TextLoader
        loader = TextLoader(file)
    else:
        print('Document format is not supported!')
        return None

    data = loader.load()
    return data


def chunk_data(data, chunk_size=256, chunk_overlap=20):
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    chunks = text_splitter.split_documents(data)
    return chunks


def create_embeddings(chunks):
    embeddings = OpenAIEmbeddings()
    vector_store = Chroma.from_documents(chunks, embeddings)
    return vector_store


def ask_and_get_answer(vector_store, user_question, system_prompt, k=3):
    from langchain.chains import RetrievalQA
    from langchain_openai import ChatOpenAI

    llm = ChatOpenAI(model='gpt-3.5-turbo', temperature=1)

    retriever = vector_store.as_retriever(
        search_type='similarity', search_kwargs={'k': k})

    chain = RetrievalQA.from_chain_type(
        llm=llm, chain_type="stuff", retriever=retriever)

    response = chain({"query": user_question})

    if response.get("result") == "I don't know.":
        assistant_message = "I couldn't find any relevant topics regarding this question. Let's try something more directly related."
    else:
        assistant_message = response["result"]

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_question},
        {"role": "assistant", "content": assistant_message}
    ]

    return messages[-1]["content"]


if __name__ == "__main__":
    from dotenv import load_dotenv, find_dotenv
    load_dotenv(find_dotenv(), override=True)

    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise ValueError(
            "OpenAI API Key not found. Please set it in the .env file.")

    hand_raised = False
    long_gaze = False
    top_3_emotion = {"Excitement": 0.342, "Surprise": 0.310, "Interest": 0.312}

    file_path = input('Enter the file path: ')
    if file_path:
        data = load_document(file_path)
        if data:
            chunk_size = int(input('Enter chunk size (default 256): ') or 256)
            k = int(input('Enter k value for retrieval (default 3): ') or 3)

            chunks = chunk_data(data, chunk_size=chunk_size)
            print(f'Chunk size: {chunk_size}, Chunks: {len(chunks)}')

            vector_store = create_embeddings(chunks)
            print('File uploaded, chunked and embedded successfully.')

            if long_gaze:
                system_prompt = f"""Explain the following question or equation. 
                Here are the top 3 emotions along with confidence level the user is feeling while asking this question:{top_3_emotion}
                Provide a simple and clear explanation to aid understanding, then summarize everything."""

            else:
                system_prompt = f"""Answer the question the user asked. 
                Here are the top 3 emotions along with confidence level the user is feeling while asking this question:{top_3_emotion}
                Based on the user's primary emotion, tailor your response accordingly:
                - If the primary emotion is 'confused', provide a simple and clear explanation to aid understanding.
                - If the primary emotion is 'frustrated', keep the response concise and to the point, using bullet points or numbered lists for clarity.
                - If the primary emotion is 'sarcastic', gently steer the conversation back to the main topic or assignment to maintain focus.
                - If the user asks an advanced question with confidence, provide a detailed and sophisticated answer that matches their level of understanding.
                """

            while True:
                user_question = input(
                    'Ask a question about the content of your file (or type "exit" to quit): ')
                if user_question.lower() == 'exit':
                    break
                if user_question:
                    answer = ask_and_get_answer(
                        vector_store, user_question, system_prompt, k)
                    print(f'LLM Answer: {answer}')
