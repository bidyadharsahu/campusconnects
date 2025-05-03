
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SGPACalculator from '@/components/calculator/SGPACalculator';
import CGPACalculator from '@/components/calculator/CGPACalculator';
import AppLayout from '@/components/layout/AppLayout';

const CalculatorPage = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-6">Grade Calculator</h1>
        
        <Tabs defaultValue="sgpa" className="w-full">
          <TabsList className="mb-6 bg-secondary/40">
            <TabsTrigger value="sgpa">SGPA Calculator</TabsTrigger>
            <TabsTrigger value="cgpa">CGPA Calculator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sgpa" className="mt-2">
            <SGPACalculator />
          </TabsContent>
          
          <TabsContent value="cgpa" className="mt-2">
            <CGPACalculator />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default CalculatorPage;
