import os
import torch
from torch import nn
import numpy as np
from kobert_transformers import get_kobert_model
from kobert_tokenizer import KoBERTTokenizer
import matplotlib.pyplot as plt


# 커스텀 분류기 정의
class BERTClassifier(nn.Module):
    def __init__(self,
                 bert,
                 hidden_size=768,
                 num_classes=8,   # 클래스 수 조정
                 dr_rate=None,
                 params=None):
        super(BERTClassifier, self).__init__()
        self.bert = bert
        self.dr_rate = dr_rate

        self.classifier = nn.Linear(hidden_size, num_classes)
        if dr_rate:
            self.dropout = nn.Dropout(p=dr_rate)

    def gen_attention_mask(self, token_ids, valid_length):
        attention_mask = torch.zeros_like(token_ids)
        for i, v in enumerate(valid_length):
            attention_mask[i][:v] = 1
        return attention_mask.float()

    def forward(self, token_ids, valid_length, segment_ids):
        attention_mask = self.gen_attention_mask(token_ids, valid_length)
        _, pooler = self.bert(input_ids=token_ids, token_type_ids=segment_ids.long(), attention_mask=attention_mask.float().to(token_ids.device), return_dict=False)
        if self.dr_rate:
            out = self.dropout(pooler)
        return self.classifier(out)

# 모델 저장 경로 설정 -> 백엔드에 파일에서 접근할 때를 기준으로 설정해줘야 함
model_save_path = 'AI/saved_model'

# 토크나이저 불러오기
tokenizer = KoBERTTokenizer.from_pretrained('skt/kobert-base-v1')

# KoBERT 모델 불러오기
bertmodel = get_kobert_model()

# 커스텀 분류기 인스턴스 생성
model = BERTClassifier(bertmodel, dr_rate=0.5).to('cuda')

# 저장된 모델 가중치 로드
model.load_state_dict(torch.load(os.path.join(model_save_path, 'pytorch_model.bin')))

# 감정별 색상 정의 (RGB)
emotion_colors = {
    "공포가": (0, 0, 0),       # 검정
    "놀람이": (128, 0, 128),   # 보라
    "분노가": (255, 0, 0),     # 빨강
    "슬픔이": (0, 0, 255),     # 파랑
    "중립이": (128, 128, 128), # 회색
    "행복이": (255, 255, 0),    # 노랑
    "혐오가": (0, 255, 0),    # 초록
    "불안이": (255, 165, 0)    # 주황
}

# 색상 혼합 함수
def mix_colors(probabilities, emotion_colors, pastel_factor=0.5):
    r, g, b = 0, 0, 0
    for i, emotion in enumerate(emotion_colors.keys()):
        color = emotion_colors[emotion]
        prob = probabilities[i]
        r += color[0] * prob
        g += color[1] * prob
        b += color[2] * prob
        
    # 파스텔 톤으로 변환
    r = (r + 255 * pastel_factor) / (1 + pastel_factor)
    g = (g + 255 * pastel_factor) / (1 + pastel_factor)
    b = (b + 255 * pastel_factor) / (1 + pastel_factor)
    
    return int(r), int(g), int(b)

# 모델과 토크나이저 사용 예제
def predict_emotion(predict_sentence, max_len=64, device='cuda'):

    # 입력 문장을 토큰화하고 텐서로 변환
    inputs = tokenizer(
        predict_sentence,
        return_tensors='pt',
        max_length=max_len,
        padding='max_length',
        truncation=True
    )

    # 필요한 텐서를 GPU로 이동
    input_ids = inputs['input_ids'].to(device)
    attention_mask = inputs['attention_mask'].to(device)
    token_type_ids = inputs['token_type_ids'].to(device)

    # 유효 길이 계산
    valid_length = torch.tensor([len(tokenizer.tokenize(predict_sentence))])

    # 모델을 평가 모드로 설정
    model.eval()

    with torch.no_grad():
        outputs = model(input_ids, valid_length, token_type_ids)

    logits = outputs
    probabilities = nn.functional.softmax(logits, dim=1)
    probabilities = probabilities.detach().cpu().numpy()[0]

    # 예측 결과
    labels = ["공포", "놀람", "분노", "슬픔", "중립", "행복", "혐오", "불안"]
    emotion_percentages = {label: float(probabilities[i]) for i, label in enumerate(labels)}

    # 색상 혼합 (파스텔 톤)
    mixed_color = mix_colors(probabilities, emotion_colors)

    return emotion_percentages, mixed_color