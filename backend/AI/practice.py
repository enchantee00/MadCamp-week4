from openai import OpenAI
import os
import time
import json

# OpenAI API 키 설정
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
# Custom GPT ID 설정
custom_gpt_id = os.getenv('CUSTOM_GPT_ID')

assistant = client.beta.assistants.retrieve(custom_gpt_id)
thread = client.beta.threads.create()


def wait_on_run(run, thread):
    while run.status == "queued" or run.status == "in_progress":
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id,
        )
        time.sleep(0.5)
    return run

message = client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content="안녕"
    )
    
run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=assistant.id,
    # instructions="사용자를 Jane Doe라고 부르세요. 사용자는 프리미엄 계정을 가지고 있습니다."
)

run = wait_on_run(run, thread)
messages = client.beta.threads.messages.list(
    thread_id=thread.id, order="asc", after=message.id
)


for message in messages.data:
    for content_block in message.content:
        if content_block.type == 'text':
            value = content_block.text.value
            print(value)

