from flask import Flask, render_template, request, jsonify
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import os
load_dotenv()

app = Flask(__name__)

def generate_queries(template: str, **kwargs) -> str:
    print(f"kwargs: {kwargs}")
    print(f"template: {template}")
    try:
        query_prompt = ChatPromptTemplate.from_messages([
            ('human', template)
        ])
        query_chain = query_prompt | ChatOpenAI(model="glm-4-plus", api_key=os.environ['ZHIPU_API_KEY'], base_url=os.environ['ZHIPU_API_BASE'])
        res = query_chain.invoke(kwargs)
        print(f"API Response: {res}")
        return res.content
    except Exception as e:
        print(f"Error during query generation: {e}")
        return ""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    try:
        print("Received data:", request.form)
        template = request.form.get('promptTemplate')
        if not template:
            return jsonify({'error': 'promptTemplate is required'}), 400
        
        variables = {k: v for k, v in request.form.items() if k != 'promptTemplate'}
        print(f"\nvariables is {variables}")
        result = generate_queries(template, **variables)
        print(f"results is {result}")
        return jsonify({'result': result})
    except Exception as e:
        print(f"Error during query generation: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)