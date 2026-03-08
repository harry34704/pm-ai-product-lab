"use client";

import { useMemo, useState } from "react";
import { StoryCategoryFilter } from "./story-category-filter";
import { StoryEditor } from "./story-editor";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StoryList({ stories }: { stories: any[] }) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedStory, setSelectedStory] = useState<any | null>(stories[0] ?? null);

  const filteredStories = useMemo(
    () => stories.filter((story) => activeCategory === "ALL" || story.category === activeCategory),
    [activeCategory, stories]
  );

  if (!stories.length) {
    return (
      <Card>
        <CardContent className="py-10 text-sm text-slate-400">No stories yet. Extract them from a resume to create a reusable STAR bank.</CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <div className="space-y-4">
        <StoryCategoryFilter value={activeCategory} onChange={setActiveCategory} />
        <div className="space-y-3">
          {filteredStories.map((story) => (
            <button
              key={story.id}
              type="button"
              onClick={() => setSelectedStory(story)}
              className="w-full rounded-2xl border border-border bg-slate-950/60 p-4 text-left transition hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{story.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{story.category.replaceAll("_", " ")}</p>
                </div>
                <Badge>{(story.tags as string[]).length} tags</Badge>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div>{selectedStory ? <StoryEditor story={selectedStory} /> : null}</div>
    </div>
  );
}
