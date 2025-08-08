import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Zap, Droplets, Leaf, Search } from 'lucide-react';

interface NutritionalValue {
  label: string;
  value: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  icon: string;
}

interface ProductAnalysisResult {
  productName: string;
  brand: string;
  category: string;
  overallScore: number;
  evaluationStatus: 'approved' | 'could-be-better' | 'not-approved';
  evaluationLabel: string;
  nutritionalValues: NutritionalValue[];
  recommendation?: string;
  imageUrl?: string;
}

interface ProductAnalysisCardProps {
  result: ProductAnalysisResult;
  onResetSearch?: () => void;
}

const ProductAnalysisCard = ({ result, onResetSearch }: ProductAnalysisCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-primary'; // Azzurro del brand per eccellente
      case 'good': return 'bg-secondary'; // Verde acqua del brand per buono
      case 'fair': return 'bg-accent'; // Accent color per discreto
      case 'poor': return 'bg-muted'; // Grigio neutro per scarso
      default: return 'bg-muted';
    }
  };

  const getEvaluationBadgeVariant = (status: 'approved' | 'could-be-better' | 'not-approved') => {
    switch (status) {
      case 'approved': return 'default'; // Verde per approvato
      case 'could-be-better': return 'secondary'; // Arancione per mediocre
      case 'not-approved': return 'destructive'; // Rosso per non approvato
      default: return 'outline';
    }
  };

  const getEvaluationBadgeClass = (status: 'approved' | 'could-be-better' | 'not-approved') => {
    switch (status) {
      case 'approved': return 'bg-green-500 hover:bg-green-600 text-white border-green-500';
      case 'could-be-better': return 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500';
      case 'not-approved': return 'bg-red-500 hover:bg-red-600 text-white border-red-500';
      default: return '';
    }
  };

  const getEvaluationIcon = (status: 'approved' | 'could-be-better' | 'not-approved') => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'could-be-better': return <Zap className="w-4 h-4 mr-1" />;
      case 'not-approved': return <XCircle className="w-4 h-4 mr-1" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Eccellente';
      case 'good': return 'Buono';
      case 'fair': return 'Discreto';
      case 'poor': return 'Scarso';
      default: return 'N/A';
    }
  };

  const getIconForNutrient = (icon: string) => {
    switch (icon) {
      case 'protein': return '💪';
      case 'fat': return '🥑';
      case 'fiber': return '🥦';
      case 'ash': return '🧱';
      case 'moisture': return '💧';
      default: return '📊';
    }
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (result.overallScore / 100) * circumference;

  // Colore del progress bar in base al punteggio
  const getProgressColor = (score: number) => {
    if (result.evaluationStatus === 'not-approved') return '#ef4444'; // Rosso per non approvato
    if (result.evaluationStatus === 'approved') return '#22c55e'; // Verde per approvato
    if (result.evaluationStatus === 'could-be-better') return '#f97316'; // Arancione per passabile
    return '#ef4444'; // Rosso per non approvato
  };

  const getScoreColor = (score: number) => {
    if (result.evaluationStatus === 'not-approved') return '#ef4444'; // Rosso per non approvato
    if (result.evaluationStatus === 'approved') return '#22c55e'; // Verde per approvato
    if (result.evaluationStatus === 'could-be-better') return '#f97316'; // Arancione per passabile
    return '#ef4444'; // Rosso per non approvato
  };

  return (
    <div className="w-full">
      <Card className="w-full max-w-none mx-auto animate-fade-in" style={{ padding: 0, margin: '0 auto' }}>
      <CardHeader className="text-center space-y-2 px-0" style={{ padding: '1rem 1rem 0.5rem 1rem' }}>
        <div className="flex items-center justify-center space-x-3">
          {result.imageUrl && (
            <img 
              src={result.imageUrl} 
              alt={result.productName}
              className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-gray-100"
            />
          )}
          <div className="text-center">
            <CardTitle className="text-lg font-bold text-gray-900 leading-tight mb-1">
              {result.productName}
            </CardTitle>
            <div className="mb-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-blue-100 text-green-800 border border-green-200">
                {result.brand}
              </span>
            </div>
          </div>
        </div>

        {/* Circular Progress */}
        <div className="flex items-center justify-center space-x-3">
          <div className="relative">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="hsl(var(--muted))"
                strokeWidth="5"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                strokeWidth="5"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke={getProgressColor(result.overallScore)}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold" style={{ color: getScoreColor(result.overallScore) }}>
                {result.overallScore}
              </span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: getScoreColor(result.overallScore) }}>
              {result.overallScore}/100
            </div>
            <Badge 
              variant={getEvaluationBadgeVariant(result.evaluationStatus)}
              className={`mt-1 ${getEvaluationBadgeClass(result.evaluationStatus)}`}
            >
              {getEvaluationIcon(result.evaluationStatus)}
              {result.evaluationLabel}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-0" style={{ padding: '0 1rem 0.5rem 1rem' }}>
        {/* Nutritional Analysis */}
        <div>
          <h3 className="text-base font-semibold text-foreground mb-2 flex items-center">
            <Leaf className="w-4 h-4 mr-2" style={{ color: '#1FC77C' }} />
            Analisi Nutrizionale
          </h3>
          
          <div className="space-y-2">
            {result.nutritionalValues.map((nutrient, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-accent rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {getIconForNutrient(nutrient.icon)}
                  </span>
                  <div>
                    <div className="font-medium text-foreground text-sm">
                      {nutrient.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {nutrient.value}%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <div 
                    className={`w-2 h-2 rounded-full ${getStatusColor(nutrient.status)}`}
                  />
                  <span className="text-xs font-medium text-foreground">
                    {getStatusText(nutrient.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        {result.recommendation && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-primary mb-1 text-sm">
                  Raccomandazione
                </h4>
                <p className="text-xs text-foreground">
                  {result.recommendation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {result.evaluationStatus === 'approved' && (
          <div className="text-center">
            <div className="text-xl mb-1">🎉</div>
            <p className="text-sm font-medium text-primary">
              Ottima Scelta per il tuo Pet!
            </p>
          </div>
        )}

        {/* Warning Message for "Could be better" */}
        {result.evaluationStatus === 'could-be-better' && (
          <div className="text-center">
            <div className="text-xl mb-1">⚠️</div>
            <p className="text-sm font-medium text-secondary">
              Prodotto accettabile, ma esistono alternative migliori
            </p>
          </div>
        )}

        {/* Alert Message for "Not approved" */}
        {result.evaluationStatus === 'not-approved' && (
          <div className="text-center">
            <div className="text-xl mb-1">❌</div>
            <p className="text-sm font-medium text-muted-foreground">
              Ti consigliamo di scegliere un prodotto diverso
            </p>
          </div>
        )}
      </CardContent>
    </Card>

    {/* Button for another analysis */}
    <div className="mt-2 px-4 pb-0 flex justify-center items-center">
      <Button 
        onClick={() => {
          // Reset the search field using the provided function
          if (onResetSearch) {
            onResetSearch();
          }
          // Scroll to the search bar
          const searchBar = document.getElementById('scannerizza-form');
          if (searchBar) {
            searchBar.scrollIntoView({ behavior: 'smooth' });
            // Focus on the search input
            const searchInput = searchBar.querySelector('input');
            if (searchInput) {
              searchInput.focus();
            }
          }
        }}
        className="group relative w-full max-w-md bg-gradient-to-br from-green-400 via-green-500 to-orange-400 hover:from-green-500 hover:via-green-600 hover:to-orange-500 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 border border-white/20 backdrop-blur-sm"
        style={{
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 25%, #fb923c 75%, #f97316 100%)',
          boxShadow: '0 8px 32px rgba(34, 197, 94, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
        }}
      >
        {/* Animated background glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-green-400 via-green-500 to-orange-400 rounded-2xl blur-sm opacity-30 group-hover:opacity-60 group-hover:blur-md transition-all duration-500 -z-10 animate-pulse"></div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
        
        <div className="relative flex items-center justify-center space-x-3">
          <div className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full group-hover:bg-white/30 transition-all duration-300">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white group-hover:scale-110 transition-transform duration-300">
              <path d="M3 7V5a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M17 3h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="1" fill="currentColor" className="animate-ping"/>
            </svg>
          </div>
          
          <span className="text-base font-bold tracking-wide group-hover:tracking-wider transition-all duration-300">
            Effettua un'altra analisi
          </span>
          
          <div className="flex items-center space-x-1">
            <span className="text-sm group-hover:animate-bounce" style={{ animationDelay: '0ms' }}>🐾</span>
            <span className="text-sm group-hover:animate-bounce" style={{ animationDelay: '150ms' }}>✨</span>
          </div>
        </div>
        
        {/* Success indicator */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
      </Button>
    </div>
    </div>
  );
};

export default ProductAnalysisCard;