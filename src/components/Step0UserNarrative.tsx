import { motion } from 'motion/react';
import { ArrowRight, Sparkles, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useWizardStore } from '@/state/wizardStore';

export function Step0UserNarrative() {
  const { userNarrative, setUserNarrative, nextStep } = useWizardStore();

  const handleContinue = () => {
    nextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Tell Us Your Story</h2>
        <p className="text-muted-foreground">
          Describe the music you want to create. Share the context, purpose, and any personal details
          that should influence your composition.
        </p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenLine className="h-5 w-5" />
            User Narrative
          </CardTitle>
          <CardDescription>
            What's the story behind your music? This could include who it's for, the occasion,
            emotions you want to evoke, or any specific themes to incorporate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-narrative">Your narrative</Label>
            <Textarea
              id="user-narrative"
              placeholder="Example: I want a song for my wife Sarah's birthday. She loves acoustic guitar and has a calm, nurturing personality. The song should feel warm and intimate, celebrating our 10 years together..."
              value={userNarrative}
              onChange={(e) => setUserNarrative(e.target.value)}
              className="min-h-[200px] resize-y"
            />
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Tips for a great narrative
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Describe the person or occasion the music is for</li>
              <li>Mention specific emotions or moods you want to capture</li>
              <li>Include any personal details that could inspire lyrics or themes</li>
              <li>Note any musical preferences or styles they enjoy</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-center">
        <Button
          onClick={handleContinue}
          size="lg"
          className="gap-2"
        >
          Continue to Selections
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
