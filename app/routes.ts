// This is a reference file for all routes in the application
export const routes = {
  home: "/",
  thePlan: "/the-plan",
  whatAreWeDoing: "/the-plan/what-are-we-doing",
  questions: {
    index: "/questions",
    question: (id: string) => `/questions/${id}`,
    answer: (id: string) => `/questions/${id}/answer`,
    answerDetail: (questionId: string, answerId: string) => `/questions/${questionId}/answers/${answerId}`,
  },
  news: {
    index: "/news",
    posts: "/news/posts",
    post: (slug: string) => `/news/posts/${slug}`,
  },
  about: {
    index: "/about",
    whoIsBehind: "/about/who-we-are",
    admin: "/admin",
  },
  auth: {
    signIn: "/login",
    signUp: "/register",
    forgotPassword: "/forgot-password",
  },
  author: {
    index: "/authors",
    profile: (slug: string) => `/authors/${slug}`,
  },
}
