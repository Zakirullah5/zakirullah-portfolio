import React from 'react';
import { useData } from '../../context/DataContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { TiltCard } from '../common/TiltCard.tsx';
import {
  Shield,
  Box,
  PlayCircle,
  Sparkles,
  Film,
  Palette,
  Video,
  Layout,
  ArrowRight
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { data } = useData();
  const { isDark } = useTheme();
  const services = data?.services || [];
  const contact = data?.contact;

  const whatsappNumber = contact?.whatsappNumber || '03439179353';
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  const getServiceIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'shield': return <Shield className="w-8 h-8 text-amber-500" />;
      case 'box': return <Box className="w-8 h-8 text-cyan-500" />;
      case 'playcircle': return <PlayCircle className="w-8 h-8 text-purple-500" />;
      case 'sparkles': return <Sparkles className="w-8 h-8 text-blue-500" />;
      case 'film': return <Film className="w-8 h-8 text-pink-500" />;
      case 'palette': return <Palette className="w-8 h-8 text-cyan-500" />;
      case 'video': return <Video className="w-8 h-8 text-purple-500" />;
      case 'layout': return <Layout className="w-8 h-8 text-emerald-500" />;
      default: return <Sparkles className="w-8 h-8 text-amber-500" />;
    }
  };

  return (
    <section id="services" className="py-16 relative">
      {/* Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full blur-[140px] pointer-events-none ${
        isDark ? 'bg-blue-600/10' : 'bg-blue-300/15'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-3 ${
            isDark ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-700'
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Creative Solutions</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Professional Services
          </h2>
          <p className={`text-sm sm:text-base mt-2 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            I provide a wide range of creative services to bring your ideas to life.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.filter((s) => s.show).map((service) => {
            const orderMessage = encodeURIComponent(
              `Hello Zakirullah! I am interested in ordering your "${service.title}" service (From $${service.price}). Please share more details and workflow.`
            );
            const whatsappUrl = `https://wa.me/92${cleanNumber.startsWith('0') ? cleanNumber.slice(1) : cleanNumber}?text=${orderMessage}`;

            return (
              <TiltCard
                key={service.id}
                maxTilt={8}
                scale={1.03}
                className={`rounded-3xl p-6 border shadow-xl flex flex-col justify-between transition-all duration-300 group ${
                  isDark
                    ? 'bg-gradient-to-b from-[#0e1633]/85 via-[#090f26]/90 to-[#050818]/95 border-blue-500/20 hover:border-purple-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                    : 'bg-white/95 border-slate-200 hover:border-blue-400 shadow-lg'
                }`}
              >
                <div>
                  {/* Top Icon & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${
                      isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}>
                      {getServiceIcon(service.icon || service.title)}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
                        Starting At
                      </span>
                      <span className="text-lg font-display font-black text-amber-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]">
                        From ${service.price}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className={`text-lg font-display font-bold mb-2 group-hover:text-blue-500 transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {service.title}
                  </h3>
                  <p className={`text-xs line-clamp-3 leading-relaxed mb-6 font-normal ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {service.description}
                  </p>
                </div>

                {/* Bottom Action: Order Now linking to WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs text-center flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(59,130,246,0.35)] transition-all transform active:scale-95"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
