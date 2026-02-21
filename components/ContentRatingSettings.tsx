import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ContentRatingSettings() {
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-dashboard-primary text-3xl font-bold mb-6">
        Content Rating Settings
      </h1>

      <form onSubmit={e => e.preventDefault()} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>General Content Rating</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="educational-value"
                className="block text-sm font-medium"
              >
                Educational Value (0-5)
              </label>
              <Slider
                id="educational-value"
                max={5}
                step={1}
                defaultValue={[3]}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="positive-messages"
                className="block text-sm font-medium"
              >
                Positive Messages (0-5)
              </label>
              <Slider
                id="positive-messages"
                max={5}
                step={1}
                defaultValue={[3]}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="role-models"
                className="block text-sm font-medium"
              >
                Role Models (0-5)
              </label>
              <Slider id="role-models" max={5} step={1} defaultValue={[3]} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Appropriateness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="violence" className="block text-sm font-medium">
                Violence (0-5)
              </label>
              <Slider id="violence" max={5} step={1} defaultValue={[2]} />
            </div>
            <div className="space-y-2">
              <label htmlFor="sexuality" className="block text-sm font-medium">
                Sexuality (0-5)
              </label>
              <Slider id="sexuality" max={5} step={1} defaultValue={[2]} />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="drug-alcohol"
                className="block text-sm font-medium"
              >
                Drug/Alcohol Use (0-5)
              </label>
              <Slider id="drug-alcohol" max={5} step={1} defaultValue={[2]} />
            </div>
            <div className="space-y-2">
              <label htmlFor="language" className="block text-sm font-medium">
                Language (0-5)
              </label>
              <Slider id="language" max={5} step={1} defaultValue={[2]} />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="concerning-content"
                className="block text-sm font-medium"
              >
                Concerning Content (0-5)
              </label>
              <Slider
                id="concerning-content"
                max={5}
                step={1}
                defaultValue={[2]}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Child&apos;s Interests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="favorite-shows"
                className="block text-sm font-medium"
              >
                Favorite Shows
              </label>
              <Input
                id="favorite-shows"
                placeholder="Enter favorite shows, separated by commas"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="favorite-themes"
                className="block text-sm font-medium"
              >
                Favorite Themes
              </label>
              <Input
                id="favorite-themes"
                placeholder="Enter favorite themes, separated by commas"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="favorite-genres"
                className="block text-sm font-medium"
              >
                Favorite Genres
              </label>
              <Input
                id="favorite-genres"
                placeholder="Enter favorite genres, separated by commas"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          Save Settings
        </Button>
      </form>
    </div>
  );
}
