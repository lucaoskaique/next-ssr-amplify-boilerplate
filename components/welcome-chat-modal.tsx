import { CheckCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface SafetyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeChatModal({ isOpen, onClose }: SafetyAlertModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />A Partnership in Safety:
            An Interactive Demo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Introduction */}
          <div className="rounded-lg p-4">
            <p className="text-md text-blue-900 dark:text-blue-100">
              Welcome to this interactive demo. You're about to chat with our AI
              assistant, designed to be a safe and helpful guide.
            </p>
          </div>

          <Separator />

          {/* See Both Sides of the Conversation Section */}
          <div className="rounded-lg bg-purple-50 p-6 dark:bg-purple-950">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-purple-800 dark:text-purple-200">
              <CheckCircle className="h-5 w-5" />
              See Both Sides of the Conversation
            </h3>
            <div className="space-y-3 text-sm text-purple-900 dark:text-purple-100">
              <p>
                In this demo, we invite you to ask questions as a child would.
                As you do, try asking about a sensitive topic like death or
                puberty. You will see two things happen:
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">For the Parent/Guardian:</h4>
                  <ul className="ml-4 list-disc space-y-1">
                    <li>
                      The Child's View: You'll receive the safe, constructive,
                      and age-appropriate response your child would get.
                    </li>
                    <li>
                      The Parent's View: A sample safety notification will
                      appear, showing you the gentle, real-time alert you would
                      receive.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <Separator />

          {/* Philosophy Section */}
          <div className="rounded-lg bg-green-50 p-6 dark:bg-green-950">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-green-800 dark:text-green-200">
              <CheckCircle className="h-5 w-5" />
              Our Philosophy: A Partnership in Safety
            </h3>
            <div className="space-y-3 text-sm text-green-900 dark:text-green-100">
              <p>
                This feature is not about surveillance; it's about creating a
                safety net. Our goal is to provide parents with the necessary
                tools to guide their children through the complexities of the
                digital world, fostering open and honest conversations about
                online safety.
              </p>
              <p className="font-medium">
                Ready to explore? Click below to start chatting.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full" variant="ghost">
            See it in Action!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
