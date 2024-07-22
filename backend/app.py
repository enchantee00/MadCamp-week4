from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
# from models.nlp_model import nlp_model_predict, summarize, keyword, generate_keywords  # 수정된 부분
from AI.colorize import predict_emotion
from AI.nlp_model import summarize
from dotenv import load_dotenv
import os
import openai
from openai import OpenAI
import time




# 환경 변수 로드
load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    input_text = db.Column(db.String(500))
    output_text = db.Column(db.String(500))

    def __init__(self, input_text, output_text):
        self.input_text = input_text
        self.output_text = output_text

# OpenAI API 키 설정
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
# Custom GPT ID 설정
custom_gpt_id = os.getenv('CUSTOM_GPT_ID')


#API
@app.route('/')
def index():
    return render_template('front.html')

@app.route('/chat')
def chat_page():
    return render_template('chat.html')


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    input_text = data['input_text']

    emotion_percentages, mixed_color = predict_emotion(input_text)
    summary = summarize(input_text)
    print(emotion_percentages)
    print(mixed_color)
    print(summary)
    # output_text = summarize(input_text)
    # output_text = keyword(input_text)
    # output_text = generate_keywords(input_text)


    # new_prediction = Prediction(input_text=input_text, output_text=output_text)
    # db.session.add(new_prediction)
    # db.session.commit()
    return jsonify({'input_text': input_text, 'emotion_percentages': emotion_percentages, 'mixed_color': mixed_color, 'summary': summary})


# 커스텀 챗봇 수행
assistant = client.beta.assistants.retrieve(custom_gpt_id)
print(assistant)
thread = client.beta.threads.create()

def wait_on_run(run, thread):
    while run.status == "queued" or run.status == "in_progress":
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id,
        )
        time.sleep(0.5)
    return run

@app.route('/chat_response', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    
    message = client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=user_message
    )
    
    run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant.id,
        instructions="사용자를 이노라고 부르세요"
    )
    
    run = wait_on_run(run, thread)
    messages = client.beta.threads.messages.list(
        thread_id=thread.id, order="asc", after=message.id
    )
        
    # response = client.completions.create(
    #     model=custom_gpt_id,
    #     prompt=user_message,
    #     max_tokens=150,
    #     n=1,
    #     stop=None,
    #     temperature=0.9
    # )
    
    # bot_message = response.choices[0].text.strip()
    
    for message in messages.data:
        for content_block in message.content:
            if content_block.type == 'text':
                value = content_block.text.value
                bot_message = value

    return jsonify({'message': value})


if __name__ == '__main__':
    app.run(debug=True)
