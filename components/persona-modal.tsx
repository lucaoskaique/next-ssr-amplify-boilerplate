'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Bot, Check, Volume2 } from 'lucide-react';
import { cn } from '@/utils/utils';
import { AgentPersona } from '@/types/client';

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPersonaSelect: (persona: AgentPersona) => void;
  selectedPersona?: AgentPersona | null;
  personas: AgentPersona[];
  isLoading?: boolean;
}

export function PersonaModal({
  isOpen,
  onClose,
  onPersonaSelect,
  selectedPersona,
  personas,
  isLoading = false,
}: PersonaModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    selectedPersona?.id || null,
  );

  useEffect(() => {
    setSelectedId(selectedPersona?.id || null);
  }, [selectedPersona]);

  const handlePersonaClick = (persona: AgentPersona) => {
    setSelectedId(persona.id);
  };

  const handleConfirm = () => {
    const agentPersona = personas.find(p => p.id === selectedId);
    if (agentPersona) {
      onPersonaSelect(agentPersona);
      onClose();
    }
  };

  const handleClose = () => {
    // Reset to the originally selected persona when closing without confirming
    setSelectedId(selectedPersona?.id || null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Choose AI Persona
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col min-h-0">
          <div className="text-sm text-muted-foreground mb-4">
            Select an AI persona to customize your chat experience. Each persona
            has a unique personality and voice.
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-muted-foreground">
                Loading personas...
              </span>
            </div>
          ) : (
            <ScrollArea className="flex-1 max-h-[400px]">
              <div className="space-y-3 pr-3">
                {personas.map(persona => (
                  <div
                    key={persona.id}
                    className={cn(
                      'flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:bg-muted/50',
                      selectedId === persona.id
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:border-muted-foreground/50',
                    )}
                    onClick={() => handlePersonaClick(persona)}
                  >
                    <Avatar className="h-12 w-12 shrink-0">
                      {persona.thumbnail && (
                        <AvatarImage
                          src={persona.thumbnail}
                          alt={persona.name}
                        />
                      )}
                      <AvatarFallback>
                        <Bot className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sm">{persona.name}</h3>
                        {selectedId === persona.id && (
                          <Check className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        A helpful AI assistant with a unique personality.
                      </p>

                      {/* Audio Preview */}
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-3 w-3 text-muted-foreground" />
                        <audio
                          controls
                          className="h-6 flex-1"
                          preload="none"
                          onClick={e => e.stopPropagation()} // Prevent triggering persona selection
                        >
                          <source
                            src={`/api/personas/${persona.id}/audio`}
                            type="audio/mpeg"
                          />
                          <span className="text-xs text-muted-foreground">
                            Audio not supported
                          </span>
                        </audio>
                      </div>
                    </div>
                  </div>
                ))}

                {personas.length === 0 && !isLoading && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No personas available at the moment.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedId || isLoading}
              className="flex-1"
            >
              {selectedId && selectedId !== selectedPersona?.id
                ? 'Apply Persona'
                : 'Keep Current'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
