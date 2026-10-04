import { publications } from "@/data/publications";
import { SectionWrapper } from "@/components/effects/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PublicationBook } from "@/components/publications/PublicationBook";

export function Publications() {
  return (
    <SectionWrapper id="publications">
      <div className="cinema-container-full">
        <SectionHeading index="04" label="Publications" title="Research contributions" emphasis="contributions" />

        <div className="space-y-20 lg:space-y-28">
          {publications.map((pub, i) => (
            <PublicationBook key={pub.title} pub={pub} index={i} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
