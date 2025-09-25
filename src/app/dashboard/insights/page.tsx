'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, User, Bot } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { getChatbotResponse } from '@/ai/flows/get-chatbot-response';
import { useDrugContext } from '@/context/drug-context';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { drugs } = useDrugContext();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // TODO: Get health conditions from user profile once available
  const userHealthConditions = "فشار خون بالا, دیابت نوع ۲";
  const userMedications = drugs.map(d => ({ 
      brandName: d.brandName, 
      activeIngredients: d.activeIngredients.map(i => ({ name: i.name, dosage: i.dosage })) 
  }));

  useEffect(() => {
    // Scroll to the bottom when a new message is added
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
      
      const response = await getChatbotResponse({
        userHealthConditions,
        userMedications,
        currentQuery: input,
        chatHistory: chatHistory,
      });

      const assistantMessage: Message = { role: 'assistant', content: response.response };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error("Failed to get chatbot response:", error);
      toast({
        variant: "destructive",
        title: "خطا",
        description: "پاسخ از چت‌بات با مشکل مواجه شد. لطفاً بعداً دوباره امتحان کنید.",
      });
       // Restore user message on error
       setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="neumorphic-card w-full h-[calc(100vh-150px)] flex flex-col">
      <CardHeader>
        <CardTitle>چت‌بات هوش مصنوعی دارو AI</CardTitle>
        <CardDescription>
          سوالات خود در مورد سلامتی و داروها را بپرسید.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <Bot className="w-12 h-12 mb-4" />
                    <p className='font-bold'>سلام! من دستیار دارویی هوشمند شما هستم. چطور می‌توانم در مراقبت از سلامتی‌تان کمک کنم؟</p>
                    <p>می‌توانید از من بپرسید: «برای سردرد چه دارویی پیشنهاد می‌کنی؟»</p>
                </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <AvatarIcon role='assistant' />
                )}
                <div
                  className={cn(
                    "p-3 rounded-lg max-w-sm md:max-w-md",
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                 {message.role === 'user' && (
                  <AvatarIcon role='user' />
                )}
              </div>
            ))}
            {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                    <AvatarIcon role='assistant' />
                    <div className="p-3 rounded-lg bg-muted flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="پیام خود را تایپ کنید..."
              className="neumorphic-input flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="neumorphic-button">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

function AvatarIcon({role}: {role: 'user' | 'assistant'}) {
    return (
        <div className='flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-card neumorphic-card'>
            {role === 'user' ? <User className='w-4 h-4' /> : <Bot className='w-4 h-4 text-primary' />}
        </div>
    )
}
