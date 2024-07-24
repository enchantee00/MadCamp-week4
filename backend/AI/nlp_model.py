import torch
from transformers import pipeline
from transformers import BartTokenizer, BartForConditionalGeneration
from transformers import TokenClassificationPipeline, AutoModelForTokenClassification, AutoTokenizer
from transformers import T5Tokenizer, T5ForConditionalGeneration
from transformers import PreTrainedTokenizerFast
from transformers import BartForConditionalGeneration
import json

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 감성 분석 example
def nlp_model_predict(input_text):
    classifier = pipeline("sentiment-analysis", model="michellejieli/emotion_text_classifier", device=0 if torch.cuda.is_available() else -1, top_k=None)
    result = classifier(input_text)
    total_score = sum(item['score'] for item in result[0])
    
    print(total_score)

    return result


# 텍스트 요약 - KoBART
tokenizer = PreTrainedTokenizerFast.from_pretrained('digit82/kobart-summarization')
model = BartForConditionalGeneration.from_pretrained('digit82/kobart-summarization').to(device)

def summarize(input_text):
    # 입력 텍스트 토큰화 및 입력 ID 생성
    text = input_text.replace('\n', ' ')
    raw_input_ids = tokenizer.encode(text)
    input_ids = [tokenizer.bos_token_id] + raw_input_ids + [tokenizer.eos_token_id]
    
    # 입력 ID를 텐서로 변환하고 GPU로 이동
    summary_ids = model.generate(torch.tensor([input_ids]).to(device),  num_beams=4,  max_length=512,  eos_token_id=1)
    output = tokenizer.decode(summary_ids.squeeze().tolist(), skip_special_tokens=True)
    return {'output': output}


# 키워드 추출
class KeyphraseExtractionPipeline(TokenClassificationPipeline):
    def __init__(self, model, *args, **kwargs):
        super().__init__(model=AutoModelForTokenClassification.from_pretrained(model).to(device),
                         tokenizer=AutoTokenizer.from_pretrained(model), *args, **kwargs)

    def postprocess(self, all_outputs):
        results = super().postprocess(all_outputs=all_outputs, aggregation_strategy="simple")
        return [result.get("word").strip() for result in results]

def keyword(input_text):
    model_name = "ml6team/keyphrase-extraction-kbir-inspec"
    extractor = KeyphraseExtractionPipeline(model=model_name, device=0 if torch.cuda.is_available() else -1)
    keyphrases = extractor(input_text)
    return keyphrases

# 키워드 생성(짧은 텍스트)
tokenizer_t5 = T5Tokenizer.from_pretrained("Voicelab/vlt5-base-keywords")
model_t5 = T5ForConditionalGeneration.from_pretrained("Voicelab/vlt5-base-keywords").to(device)

def generate_keywords(input_text):
    task_prefix = "Keywords: "
    input_sequence = task_prefix + input_text
    input_ids = tokenizer_t5(input_sequence, return_tensors="pt", truncation=True).input_ids.to(device)
    output = model_t5.generate(input_ids, no_repeat_ngram_size=3, num_beams=4)
    print(output)
    return tokenizer_t5.decode(output[0], skip_special_tokens=True)


# def KoBERT(input):
#     # kobert sentiment-analysis
#     pipe = pipeline("feature-extraction", model="HyeonSang/kobert-sentiment", from_tf=True)
#     result = pipe(input)
#     return result



txt = """Dear Diary, 
Today was an interesting day. I woke up early, feeling refreshed and ready to tackle the day. The weather was warm and sunny, perfect for the plans I had in mind.

I started my day with a morning jog at the park. The fresh air and the sound of birds chirping made it a wonderful experience. After my jog, I stopped by my favorite café for a cup of coffee and a croissant. The barista was cheerful and the coffee was perfect, just the way I like it.

In the afternoon, I decided to visit the local museum. They had a new exhibit on ancient civilizations, which was fascinating. I spent hours wandering through the halls, absorbing all the information and admiring the artifacts on display.

Later, I met up with some friends for lunch at a new restaurant in town. The food was delicious, and we had a great time catching up. We talked about everything from work to travel plans, and it felt good to be surrounded by good company.

In the evening, I went home and spent some time reading a book I've been enjoying. It's a thriller, and I find it hard to put down. The plot is gripping, and the characters are well-developed.

As the day comes to an end, I feel grateful for all the wonderful experiences I had today. It's days like these that remind me of the beauty of everyday moments.

Goodnight, Diary."""

korean_txt = "아 힘들다"
# nlp_model_predict(txt)

# print(summarize(txt))

# print(KoBERT(korean_txt))