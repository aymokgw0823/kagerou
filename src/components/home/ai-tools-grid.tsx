import { aiTools } from "@/config/ai-tools";
import { getBusiness } from "@/config/businesses";
import { Card } from "@/components/ui/card";

export function AiToolsGrid() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {aiTools.map((t) => {
        const b = getBusiness(t.business);
        return (
          <li key={t.id}>
            <Card
              title={t.name}
              description={t.description}
              href={t.href}
              linkLabel="無料で試す"
              accentVar={b.colorVar}
              meta={
                <>
                  <span className="font-bold" style={{ color: `var(${b.colorVar})` }}>
                    {b.shortJa}
                  </span>
                  <span>｜</span>
                  <span>{t.duration}</span>
                </>
              }
            />
          </li>
        );
      })}
    </ul>
  );
}
