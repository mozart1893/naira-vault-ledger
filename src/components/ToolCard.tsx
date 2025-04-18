
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface ToolProps {
  category: string;
  name: string;
  description: string;
}

export const ToolCard = ({ category, name, description }: ToolProps) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <CheckCircle className="h-4 w-4 text-vault-primary mr-2" />
          <span>{name}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{category}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};
