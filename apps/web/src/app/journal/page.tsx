import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PositionsTab } from './positions-tab';
import { AddPositionTab } from './add-position-tab';

export default function JournalPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Investment Journal</h1>
        <p className="text-muted-foreground mt-2">
          Track your investment theses and review triggers
        </p>
      </div>

      <Tabs defaultValue="positions" className="w-full">
        <TabsList>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="add">Add Position</TabsTrigger>
        </TabsList>
        <TabsContent value="positions" className="mt-6">
          <PositionsTab />
        </TabsContent>
        <TabsContent value="add" className="mt-6">
          <AddPositionTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
