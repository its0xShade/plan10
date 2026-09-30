"use client";

import * as React from "react";
import { BookOpen, Plus, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BOOKS_SEED, type BookSeed } from "@/lib/data/books-data";
import { useStore } from "@/lib/store";
import { fa } from "@/lib/utils";

interface BookState {
  prog: Record<string, number>;
  rating: Record<string, number>;
  notes: Record<string, string>;
  custom: BookSeed[];
}

function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <span className="flex gap-0.5" role="radiogroup" aria-label="ارتباط">
      {[1, 2, 3, 4, 5].map((v) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          aria-label={`${v} از ۵`}
          onClick={() => onChange(v === value ? 0 : v)}
          className="p-2 transition-transform hover:scale-110"
        >
          <Star className={`size-4 ${v <= value ? "fill-brand text-brand" : "text-muted-foreground/50"}`} />
        </button>
      ))}
    </span>
  );
}

export default function BooksPage() {
  const [state, setState] = useStore<BookState>("plan10.books", { prog: {}, rating: {}, notes: {}, custom: [] });
  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");

  const books = [...BOOKS_SEED, ...state.custom];
  const readCount = books.filter((b) => (state.prog[b.id] ?? 0) >= 100).length;
  const started = books.filter((b) => (state.prog[b.id] ?? 0) > 0).length;

  const patch = (id: string, p: Partial<Pick<BookState, "prog" | "rating" | "notes">>) =>
    setState({
      ...state,
      prog: { ...state.prog, ...(p.prog ?? {}) },
      rating: { ...state.rating, ...(p.rating ?? {}) },
      notes: { ...state.notes, ...(p.notes ?? {}) },
    });

  const addBook = () => {
    if (!title.trim()) return;
    const id = `custom-${Date.now()}`;
    setState({ ...state, custom: [...state.custom, { id, title: title.trim(), author: author.trim() || "—", pages: 0 }] });
    setTitle("");
    setAuthor("");
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <BookOpen className="size-7 text-brand" />
        <div>
          <h1 className="text-2xl font-bold">کتابخانه ۱۰ کتاب</h1>
          <p className="text-sm text-muted-foreground">پیشرفت خواندن، امتیاز و نقل‌قول‌ها — هدف: ۱۰ کتاب تا پایان برنامه</p>
        </div>
        <Badge variant="secondary" className="ms-auto">
          {fa(readCount)} خوانده‌شده از {fa(books.length)} · {fa(started)} شروع‌شده
        </Badge>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {books.map((b) => {
          const prog = state.prog[b.id] ?? 0;
          const rating = state.rating[b.id] ?? 0;
          const isCustom = b.id.startsWith("custom-");
          return (
            <Card key={b.id}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between gap-2 text-base">
                  <span className="leading-7">
                    {b.title}
                    <span className="block text-xs font-normal text-muted-foreground">
                      {b.author}
                      {b.pages > 0 && ` · ${fa(b.pages)} صفحه`}
                    </span>
                  </span>
                  {isCustom && (
                    <button
                      type="button"
                      aria-label="حذف کتاب"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setState({ ...state, custom: state.custom.filter((c) => c.id !== b.id) })}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Progress value={prog} className="h-2 flex-1" />
                  <span className="w-10 text-xs font-bold text-brand">{fa(prog)}٪</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={prog}
                  aria-label={`پیشرفت ${b.title}`}
                  onChange={(e) => patch(b.id, { prog: { [b.id]: Number(e.target.value) } })}
                  className="w-full accent-[var(--brand)]"
                />
                <div className="flex items-center justify-between">
                  <Stars value={rating} onChange={(v) => patch(b.id, { rating: { [b.id]: v } })} />
                  <span className="text-[11px] text-muted-foreground">
                    {prog >= 100 ? "خوانده‌شده ✓" : prog > 0 ? "در حال خواندن" : "شروع‌نشده"}
                  </span>
                </div>
                <textarea
                  value={state.notes[b.id] ?? ""}
                  onChange={(e) => patch(b.id, { notes: { [b.id]: e.target.value } })}
                  rows={2}
                  placeholder="نقل‌قول / نکته‌ای که می‌خواهی بعداً برگردی…"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs leading-6 outline-none focus:border-brand/50"
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-3 pt-5">
          <label className="flex-1">
            <span className="mb-1 block text-xs text-muted-foreground">کتاب جدید</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addBook()}
              placeholder="عنوان…"
              className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-brand/50"
            />
          </label>
          <label className="w-40">
            <span className="mb-1 block text-xs text-muted-foreground">نویسنده</span>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addBook()}
              placeholder="اختیاری"
              className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-brand/50"
            />
          </label>
          <Button onClick={addBook}>
            <Plus className="size-4" />
            افزودن
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
