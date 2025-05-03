"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Search, MoreVertical, Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

interface Question {
  _id: string;
  number: number;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
}

export default function QuestionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  console.log(user);
  useEffect(() => {
    if (!user || user.role !== "super_admin") {
      // router.push("/admin");
      return;
    }

    async function fetchQuestions() {
      try {
        setLoading(true);
        const response = await fetch("/api/questions");

        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }

        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("Failed to fetch questions");
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [user, router]);

  const filteredQuestions = questions.filter(
    (question) =>
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.number.toString().includes(searchTerm)
  );

  async function deleteQuestion(questionId: string) {
    if (
      !confirm(
        "Are you sure you want to delete this question? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete question");
      }

      toast.success("Question deleted successfully");

      // Update the questions in the local state
      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question._id !== questionId)
      );

      setActiveQuestion(null);
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Failed to delete question");
    }
  }

  return (
    <div className="bg-[#f3f2f2] min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Question Management</h1>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  className="pl-10 pr-4 py-2 w-full border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Link href="/admin/questions/new">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Question
                </Button>
              </Link>
            </div>

            {loading ? (
              <p className="text-center py-4">Loading questions...</p>
            ) : filteredQuestions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredQuestions.map((question) => (
                      <tr key={question._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {question.number}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{question.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-md">
                            {question.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(question.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full"
                              onClick={() =>
                                setActiveQuestion(
                                  activeQuestion === question._id
                                    ? null
                                    : question._id
                                )
                              }
                            >
                              <MoreVertical className="h-5 w-5" />
                            </Button>

                            {activeQuestion === question._id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                <div className="py-1">
                                  <Link
                                    href={`/admin/questions/${question._id}/edit`}
                                  >
                                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                      <Pencil className="h-4 w-4 mr-2" />
                                      Edit Question
                                    </button>
                                  </Link>
                                  <button
                                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                    onClick={() => deleteQuestion(question._id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Question
                                  </button>
                                  <Link href={`/questions/${question._id}`}>
                                    <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                      View Public Page
                                    </button>
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4">No questions found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
