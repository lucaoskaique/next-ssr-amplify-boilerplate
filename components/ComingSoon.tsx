import { Profile } from '@/types/client';
import { Clock, Construction } from 'lucide-react';

interface ComingSoonProps {
  profile: Profile;
}

export function ComingSoon({ profile }: ComingSoonProps) {
  return (
    <main>
      <div className="w-full px-4 flex flex-col gap-6">
        <div className="text-center mb-12">
          <h1 className="text-xl font-semibold mb-2">
            Content Settings for {profile.name}
          </h1>
          <p className="text-gray-600">
            Customize content restrictions based on age and maturity level.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 shadow-sm border border-gray-100 max-w-md w-full mb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <Clock className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-center mb-3">
              Coming Soon
            </h2>
            <p className="text-gray-600 text-center mb-6">
              We&apos;re working on advanced content settings to give you more
              control over what {profile.name} can access.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-primary">
              <Construction className="h-4 w-4" />
              <span>Under Development</span>
            </div>
          </div>

          <p className="text-gray-500 text-sm text-center max-w-md">
            This feature will allow you to customize content filters, set time
            limits, and create personalized restrictions based on your
            child&apos;s unique needs.
          </p>
        </div>

        <div className="flex justify-center mt-4">
          <button
            className="px-6 py-2 bg-primary-400 rounded-md text-primary-25 hover:bg-primary-600 transition-colors"
            onClick={() => (window.location.href = '/')}
          >
            Go to Home
          </button>
        </div>
      </div>
    </main>
  );
}

export default ComingSoon;
