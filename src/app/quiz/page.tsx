"use client";

import * as React from "react";
import { Brain, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart } from "@/components/charts";
import { dailyQuestions } from "@/lib/quiz-data";
import { useStore, todayISO, shortDay } from "@/lib/store";
import { fa } from "@/lib/utils";

export default function QuizPage() {
  const today = todayISO();
  const questions = React.useMemo(() => dailyQuestions(today), [today]);
  const [scores, setScores] = useStore<Record<string, number>>("plan10.quiz", {});
  const [answers, setAnswers] = React.useState<Record<number, number>>({});
  const submitted = scores[today] !== undefined;

  const grade = () => {
    let right = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) right++;
    });
    setScores({ ...scores, [today]: right });
  };

  const score = scores[today];
  const last14 = Object.keys(scores)
    .sort()
    .slice(-14);
  const avg = last14.length ? last14.reduce((a, k) => a + scores[k], 0) / last14.length : null;

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <Brain className="size-7 text-brand" />
        <div>
          <h1 className="text-2xl font-bold">کوییز روزانه</h1>
          <p className="text-sm text-muted-foreground">
            ۵ سؤال تصادفی از بانک {fa(37)} سؤالی — هر روز ست جدید، تا پایان روز ثابت
          </p>
        </div>
        <Badge variant="secondary" className="ms-auto">
          {fa(last14.length)} روز ثبت‌شده
        </Badge>
      </header>

      {(score !== undefined || avg !== null) && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-5 text-center">
              <div className="text-2xl font-bold text-brand">{score !== undefined ? `${fa(score)}/${fa(5)}` : "—"}</div>
              <div className="text-xs text-muted-foreground">امتیاز امروز</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 text-center">
              <div className="text-2xl font-bold">{avg !== null ? fa(Math.round(avg * 10) / 10) : "—"}</div>
              <div className="text-xs text-muted-foreground">میانگین ثبت‌شده</div>
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardContent className="pt-4">
              <div className="mb-1 text-xs text-muted-foreground">اقدامات ۱۴ روز اخیر (از ۵)</div>
              <BarChart
                height={70}
                labels={last14.map((k) => shortDay(k))}
                values={last14.map((k) => scores[k])}
                color="var(--brand)"
              />
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        {questions.map((q, i) => {
          const chosen = answers[i];
          const isWrong = submitted && chosen !== undefined && chosen !== q.correct;
          return (
            <Card key={i}>
              <CardContent className="space-y-3 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-medium leading-7">
                    <span className="text-muted-foreground">{fa(i + 1)}.</span> {q.q}
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {q.topic}
                  </Badge>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, oi) => {
                    const chosenThis = chosen === oi;
                    const correctNow = submitted && oi === q.correct;
                    let cls = "border-border hover:border-brand/50 hover:bg-accent/50";
                    if (!submitted && chosenThis) cls = "border-brand bg-brand/10";
                    if (submitted && correctNow) cls = "border-emerald-500/60 bg-emerald-500/10";
                    if (submitted && isWrong && chosenThis) cls = "border-destructive/60 bg-destructive/10";
                    return (
                      <button
                        key={oi}
                        type="button"
                        disabled={submitted}
                        onClick={() => setAnswers((a) => ({ ...a, [i]: oi }))}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-start text-sm transition-colors ${cls}`}
                      >
                        <span className="size-4 shrink-0 rounded-full border border-border" dir="ltr">
                          {correctNow ? (
                            <CheckCircle2 className="size-4 text-emerald-500" />
                          ) : isWrong && chosenThis ? (
                            <XCircle className="size-4 text-destructive" />
                          ) : chosenThis ? (
                            <span className="m-0.5 block size-2.5 rounded-full bg-brand" />
                          ) : null}
                        </span>
                        <span dir="auto">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="rounded-lg bg-secondary/60 px-3 py-2 text-xs leading-6 text-muted-foreground">
                    <b className="text-foreground">توضیح:</b> {q.why}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        {!submitted ? (
          <Button size="lg" onClick={grade} disabled={Object.keys(answers).length === 0}>
            ثبت پاسخ‌ها ({fa(Object.keys(answers).length)}/{fa(5)})
          </Button>
        ) : (
          <Badge variant="success" className="px-3 py-1.5">
            نتیجه امروز: {fa(score)} از {fa(5)} — فردا ست جدید میاد
          </Badge>
        )}
        {submitted && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const s = { ...scores };
              delete s[today];
              setScores(s);
              setAnswers({});
            }}
          >
            شروع دوباره
          </Button>
        )}
      </div>
    </div>
  );
}
