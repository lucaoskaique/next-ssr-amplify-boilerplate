import { AgentPersona } from '@/types/client';

export function serializePersona(persona: any): AgentPersona {
  return {
    id: persona.id,
    codename: persona.codename,
    name: persona.name,
    template: persona.template,
    voice_id: persona.voice_id,
    similarity_boost: persona.similarity_boost,
    stability: persona.stability,
    style: persona.style,
    use_speaker_boost: persona.use_speaker_boost,
    model_id: persona.model_id,
    image: persona.image,
    thumbnail: persona.thumbnail,
    sample_audio: persona.sample_audio,
  };
}
