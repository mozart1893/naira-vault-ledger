
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface UserStoryProps {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
}

export const UserStoryCard = ({ 
  id, 
  title, 
  description, 
  acceptanceCriteria 
}: UserStoryProps) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          <span className="text-sm text-muted-foreground font-normal">{id}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Acceptance Criteria:</h4>
          <ul className="space-y-1">
            {acceptanceCriteria.map((criteria, index) => (
              <li key={index} className="flex items-start text-sm">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{criteria}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
