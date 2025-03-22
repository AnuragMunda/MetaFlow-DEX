import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddLiquidity } from './add-liquidity';
import { RemoveLiquidity } from './remove-liquidity';
import { Positions } from './positions';

export const LiquidityTabs: React.FC = () => {
  return (
    <Tabs defaultValue="positions" className="w-full">
      <TabsList className="grid grid-cols-3 mb-8 self-center">
        <TabsTrigger value="positions" className=" cursor-pointer">Your Positions</TabsTrigger>
        <TabsTrigger value="add" className=" cursor-pointer">Add Liquidity</TabsTrigger>
        <TabsTrigger value="remove" className=" cursor-pointer">Remove Liquidity</TabsTrigger>
      </TabsList>
      
      <TabsContent value="positions" className="animate-fade-in">
        <Positions />
      </TabsContent>
      
      <TabsContent value="add" className="animate-fade-in">
        <AddLiquidity />
      </TabsContent>
      
      <TabsContent value="remove" className="animate-fade-in">
        <RemoveLiquidity />
      </TabsContent>
    </Tabs>
  );
};