import React from 'react';
import { X, ShieldAlert, Heart, Phone } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'about' | 'crisis';
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'about',
}) => {
  const [activeTab, setActiveTab] = React.useState<'about' | 'crisis'>(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl bg-[#0e131d] border border-white/[0.08] p-6 shadow-2xl space-y-5 my-8 text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('about')}
              className={`text-sm font-medium transition-colors px-2 py-1 rounded-lg ${
                activeTab === 'about' ? 'text-[#f2f1ed] bg-white/[0.08]' : 'text-[#626b80] hover:text-[#9aa2b5]'
              }`}
            >
              About Moonroom
            </button>
            <button
              onClick={() => setActiveTab('crisis')}
              className={`text-sm font-medium transition-colors px-2 py-1 rounded-lg flex items-center gap-1.5 ${
                activeTab === 'crisis' ? 'text-[#f2f1ed] bg-white/[0.08]' : 'text-[#626b80] hover:text-[#9aa2b5]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#b3aed8]" />
              <span>Safety & Support</span>
            </button>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#626b80] hover:text-[#f2f1ed] hover:bg-white/[0.04] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {activeTab === 'about' ? (
          <div className="space-y-4 text-xs sm:text-sm text-[#9aa2b5] leading-relaxed">
            <div>
              <h2 id="about-modal-title" className="font-serif text-xl text-[#f2f1ed] mb-1">
                A quiet place for a restless mind.
              </h2>
              <p className="text-xs text-[#626b80] font-serif italic">
                A nighttime wellness and relaxation space.
              </p>
            </div>

            <p>
              Moonroom was created for people whose minds feel noisy, racing, or difficult to quiet at night. It is designed to feel like entering a calm digital room at 2 AM—minimal, respectful, and private.
            </p>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#f2f1ed]">
                Wellness & Responsible Use Notice
              </h3>
              <p className="text-xs text-[#9aa2b5]">
                Moonroom is a wellness and relaxation resource. It is not medical treatment, cognitive behavioral therapy for insomnia (CBT-I), or a substitute for professional medical advice, diagnosis, or care. These exercises do not claim to cure insomnia or clinical sleep disorders.
              </p>
              <p className="text-xs text-[#9aa2b5]">
                If chronic sleep disturbances or anxiety significantly interfere with your daily energy, mood, or functioning, please consult a qualified physician or healthcare professional.
              </p>
            </div>

            <div className="pt-1 text-xs text-[#626b80]">
              <p>Your notes and preferences remain stored solely on your device.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs sm:text-sm text-[#9aa2b5] leading-relaxed">
            <div>
              <h2 id="about-modal-title" className="font-serif text-xl text-[#f2f1ed] mb-1 flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#c4b5fd]" />
                <span>Immediate Support & Crisis Lines</span>
              </h2>
              <p className="text-xs text-[#626b80]">
                If you are in immediate distress or having thoughts of self-harm, please reach out right away. Caring people are ready to support you.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-[#f2f1ed]">United States & Canada</span>
                  <span className="font-mono text-xs text-[#c4b5fd]">Dial 988</span>
                </div>
                <p className="text-xs text-[#9aa2b5]">
                  Suicide & Crisis Lifeline. Free, confidential, 24/7 support by phone or text.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-[#f2f1ed]">Crisis Text Line</span>
                  <span className="font-mono text-xs text-[#c4b5fd]">Text HOME to 741741</span>
                </div>
                <p className="text-xs text-[#9aa2b5]">
                  Free 24/7 crisis support via text message throughout the US, UK, and Canada.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-[#f2f1ed]">United Kingdom</span>
                  <span className="font-mono text-xs text-[#c4b5fd]">Dial 111 or 999</span>
                </div>
                <p className="text-xs text-[#9aa2b5]">
                  Samaritans free hotline: 116 123 (available 24/7).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-[#f2f1ed]">International Resources</span>
                  <span className="font-mono text-xs text-[#c4b5fd]">findahelpline.com</span>
                </div>
                <p className="text-xs text-[#9aa2b5]">
                  Free, confidential support services in over 130 countries worldwide.
                </p>
              </div>
            </div>

            <p className="text-xs text-[#626b80] italic">
              Please contact emergency services (911/999/112) or go to the nearest emergency center if you or someone you know is in immediate danger.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-[#f2f1ed] text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
