from konlpy.tag import Okt
import re
from krwordrank.word import KRWordRank
import json

def split_noun_sentences(text):
    okt = Okt()
    sentences = text.replace(". ",".")
    sentences = re.sub(r'([^\n\s\.\?!]+[^\n\.\?!]*[\.\?!])', r'\1\n', sentences).strip().split("\n")
    
    result = []
    for sentence in sentences:
        if len(sentence) == 0:
            continue
        sentence_pos = okt.pos(sentence, stem=True)
        nouns = [word for word, pos in sentence_pos if pos == 'Noun']
        if len(nouns) == 1:
            continue
        result.append(' '.join(nouns) + '.')
        
    return result


def keywords(input):
    text = input
    min_count = 1   # 단어의 최소 출현 빈도수 (그래프 생성 시)
    max_length = 10 # 단어의 최대 길이
    wordrank_extractor = KRWordRank(min_count=min_count, max_length=max_length)
    beta = 0.85    # PageRank의 decaying factor beta
    max_iter = 20
    texts = split_noun_sentences(text)
    keywords, rank, graph = wordrank_extractor.extract(texts, beta, max_iter)

    # 상위 키워드 2개 출력
    top_keywords = sorted(keywords.items(), key=lambda x: x[1], reverse=True)[:2]
    # 리스트를 딕셔너리로 변환
    keywords_dict = {word: score for word, score in top_keywords}
    
    return keywords_dict
    
    # for word, r in top_keywords:
    #     print('%8s:\t%.4f' % (word, r))
    



