import { describe, expect, it } from "vitest";
import { bigrams, normalize, scoreDoc, search, splitQuery } from "../ngram";

const docs = [
  {
    slug: "a",
    title: "外壁のチョーキング現象と塗り替え時期",
    description: "外壁を手で触ると白い粉がつく症状について",
    body: "チョーキングは塗膜の劣化サインです。放置すると防水性が落ちます。",
  },
  {
    slug: "b",
    title: "飲食店の厨房レイアウト",
    description: "動線と収納の考え方",
    body: "厨房の動線は営業効率に直結します。",
  },
  {
    slug: "c",
    title: "雨漏りに気づいたら",
    description: "応急処置と相談のタイミング",
    body: "屋根からの雨漏りは早めの点検を。",
  },
];

describe("ngram search", () => {
  it("正規化は全角・大文字・空白を吸収する", () => {
    expect(normalize("ＡＢＣ　外壁 ")).toBe("abc外壁");
  });
  it("bigram を生成する", () => {
    expect(bigrams("外壁塗装")).toEqual(["外壁", "壁塗", "塗装"]);
    expect(bigrams("壁")).toEqual(["壁"]);
  });
  it("空白で AND 検索する", () => {
    expect(splitQuery("外壁　ひび割れ  塗装")).toEqual(["外壁", "ひび割れ", "塗装"]);
    expect(scoreDoc(docs[0], "外壁 粉")).toBeGreaterThan(0);
    expect(scoreDoc(docs[0], "外壁 厨房")).toBe(0);
  });
  it("日本語の部分一致でヒットし、タイトル一致が優先される", () => {
    const r = search(docs, "厨房");
    expect(r.map((x) => x.doc.slug)).toEqual(["b"]);
    const r2 = search(docs, "劣化");
    expect(r2[0].doc.slug).toBe("a");
  });
  it("表記ゆれは bigram の一致率で拾う", () => {
    // 「雨漏り点検」は連続しないが bigram の多くが本文に含まれる
    expect(scoreDoc(docs[2], "雨漏り点検")).toBeGreaterThan(0);
    expect(scoreDoc(docs[1], "雨漏り点検")).toBe(0);
  });
});
