import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard.jsx';
import { Link } from 'react-router-dom';

export default function AnalyticsDashboardPage() {
  return (
    <div className="theme-page min-h-screen">
      <section className="section-padding">
        <div className="section-container">
          <div className="mb-4 flex items-center justify-start">
            <Link
              to="/"
              className="theme-button-secondary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
            >
              <span aria-hidden="true">←</span>
              <span>Back to Home</span>
            </Link>
          </div>
          <AnalyticsDashboard />
        </div>
      </section>
    </div>
  );
}
