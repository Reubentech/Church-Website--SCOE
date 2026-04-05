import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Loader from "./components/ui/Loader";
import AnnouncementBanner from "./components/ui/AnnouncementBanner";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Sermons from "./pages/Sermons";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrayerRequest from "./pages/PrayerRequest";
import BibleStudy from "./pages/BibleStudy";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Bulletin from "./pages/Bulletin";
import Dashboard from "./pages/admin/Dashboard";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageSermons from "./pages/admin/ManageSermons";
import ManageGallery from "./pages/admin/ManageGallery";
import ManageMessages from "./pages/admin/ManageMessages";
import ManagePrayers from "./pages/admin/ManagePrayers";
import ManageBibleStudy from "./pages/admin/ManageBibleStudy";
import ManageAnnouncements from "./pages/admin/ManageAnnouncements";
import ManageNewsletter from "./pages/admin/ManageNewsletter";
import ManageBlog from "./pages/admin/ManageBlog";
import ManageUsers from "./pages/admin/ManageUsers";
import SiteSettings from "./pages/admin/SiteSettings";
import ActivityLogs from "./pages/admin/ActivityLogs";
import Analytics from "./pages/admin/Analytics";

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <Loader />;
  if (!user || !isAdmin) return <Navigate to="/login" />;
  return children;
};

function AppRoutes() {
  const { loading } = useAuth();
  if (loading) return <Loader />;
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBanner />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/sermons" element={<Sermons />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/prayer-request" element={<PrayerRequest />} />
          <Route path="/bible-study" element={<BibleStudy />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/bulletin" element={<Bulletin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/events" element={<AdminRoute><ManageEvents /></AdminRoute>} />
          <Route path="/admin/sermons" element={<AdminRoute><ManageSermons /></AdminRoute>} />
          <Route path="/admin/gallery" element={<AdminRoute><ManageGallery /></AdminRoute>} />
          <Route path="/admin/messages" element={<AdminRoute><ManageMessages /></AdminRoute>} />
          <Route path="/admin/prayers" element={<AdminRoute><ManagePrayers /></AdminRoute>} />
          <Route path="/admin/bible-study" element={<AdminRoute><ManageBibleStudy /></AdminRoute>} />
          <Route path="/admin/announcements" element={<AdminRoute><ManageAnnouncements /></AdminRoute>} />
          <Route path="/admin/newsletter" element={<AdminRoute><ManageNewsletter /></AdminRoute>} />
          <Route path="/admin/blog" element={<AdminRoute><ManageBlog /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><SiteSettings /></AdminRoute>} />
          <Route path="/admin/logs" element={<AdminRoute><ActivityLogs /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
