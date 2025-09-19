"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Trash, Plus, BookOpen } from "lucide-react";
import { format } from "date-fns";

// Define types
type Subject = "Telugu" | "Hindi" | "English" | "Maths" | "PS" | "NS" | "Social";

interface Homework {
  id: string;
  subject: Subject;
  task: string;
  dueDate: string;
}

// Fixed subjects
const SUBJECTS: Subject[] = ["Telugu", "Hindi", "English", "Maths", "PS", "NS", "Social"];

// Subject colors for visual distinction
const SUBJECT_COLORS: Record<Subject, string> = {
  Telugu: "bg-red-100 border-red-300 text-red-800",
  Hindi: "bg-orange-100 border-orange-300 text-orange-800",
  English: "bg-blue-100 border-blue-300 text-blue-800",
  Maths: "bg-green-100 border-green-300 text-green-800",
  PS: "bg-purple-100 border-purple-300 text-purple-800",
  NS: "bg-yellow-100 border-yellow-300 text-yellow-800",
  Social: "bg-pink-100 border-pink-300 text-pink-800",
};

export default function HomeworkApp() {
  const [homeworkList, setHomeworkList] = useState<Homework[]>([]);
  const [newHomework, setNewHomework] = useState({
    subject: "" as Subject | "",
    task: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(true);

  // Simulate loading data
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      // Load sample data
      setHomeworkList([
        {
          id: "1",
          subject: "Maths",
          task: "Complete exercises 1-10 on page 45",
          dueDate: "2023-06-15",
        },
        {
          id: "2",
          subject: "English",
          task: "Write a summary of Chapter 3",
          dueDate: "2023-06-18",
        },
        {
          id: "3",
          subject: "Social",
          task: "Prepare for chapter test on Ancient Civilizations",
          dueDate: "2023-06-20",
        },
      ]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleAddHomework = () => {
    if (!newHomework.subject || !newHomework.task || !newHomework.dueDate) return;

    const newTask: Homework = {
      id: Date.now().toString(),
      subject: newHomework.subject as Subject,
      task: newHomework.task,
      dueDate: newHomework.dueDate,
    };

    setHomeworkList([...homeworkList, newTask]);
    setNewHomework({ subject: "", task: "", dueDate: "" });
  };

  const handleDeleteHomework = (id: string) => {
    setHomeworkList(homeworkList.filter((hw) => hw.id !== id));
  };

  const groupedHomework = SUBJECTS.reduce((acc, subject) => {
    acc[subject] = homeworkList.filter((hw) => hw.subject === subject);
    return acc;
  }, {} as Record<Subject, Homework[]>);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <BookOpen className="h-16 w-16 animate-bounce text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Loading Homework App</h1>
          <div className="mt-4 h-2 w-64 rounded-full bg-gray-200">
            <div className="h-full rounded-full bg-blue-500 animate-pulse" style={{ width: "75%" }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">Homework Tracker</h1>
          <p className="mt-2 text-gray-600">Manage your assignments by subject</p>
        </header>

        {/* Add Homework Form */}
        <Card className="mb-8 border-0 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Homework
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">Task Details</label>
                <Textarea
                  placeholder="What homework do you need to complete?"
                  value={newHomework.task}
                  onChange={(e) => setNewHomework({ ...newHomework, task: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Subject</label>
                <Select 
                  value={newHomework.subject} 
                  onValueChange={(value) => setNewHomework({ ...newHomework, subject: value as Subject })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Due Date</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={newHomework.dueDate}
                    onChange={(e) => setNewHomework({ ...newHomework, dueDate: e.target.value })}
                  />
                  <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleAddHomework}
                disabled={!newHomework.subject || !newHomework.task || !newHomework.dueDate}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Homework
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Homework by Subject */}
        <div className="space-y-8">
          {SUBJECTS.map((subject) => (
            <div key={subject}>
              <h2 className={`mb-4 text-2xl font-bold ${SUBJECT_COLORS[subject]}`}>
                {subject}
              </h2>
              
              {groupedHomework[subject].length === 0 ? (
                <Card className="border-0 bg-white p-6 text-center shadow">
                  <p className="text-gray-500">No homework assigned for {subject}</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {groupedHomework[subject].map((homework) => (
                    <Card key={homework.id} className="border-0 bg-white shadow transition-all hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex justify-between">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${SUBJECT_COLORS[subject]}`}>
                            {homework.subject}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteHomework(homework.id)}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <p className="mt-3 text-gray-700">{homework.task}</p>
                        
                        <div className="mt-4 flex items-center text-sm text-gray-500">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Due: {format(new Date(homework.dueDate), "MMM dd, yyyy")}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}