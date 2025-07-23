import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Zap, Droplets, Leaf } from 'lucide-react';

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
}

const ProductAnalysisCard = ({ result }: ProductAnalysisCardProps) => {
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
    if (score >= 65) return '#22c55e'; // Verde per approvato
    if (score >= 40) return '#f97316'; // Arancione per mediocre
    return '#ef4444'; // Rosso per non approvato
  };

  const getScoreColor = (score: number) => {
    if (score >= 65) return '#22c55e'; // Verde per approvato
    if (score >= 40) return '#f97316'; // Arancione per mediocre
    return '#ef4444'; // Rosso per non approvato
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          {result.imageUrl && (
            <img 
              src={result.imageUrl} 
              alt={result.productName}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            <CardTitle className="text-xl font-bold text-foreground">
              {result.productName}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {result.brand} • {result.category}
            </p>
          </div>
        </div>

        {/* Circular Progress */}
        <div className="flex items-center justify-center space-x-4">
          <div className="relative">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="hsl(var(--muted))"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                strokeWidth="6"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke={getProgressColor(result.overallScore)}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold" style={{ color: getScoreColor(result.overallScore) }}>
                {result.overallScore}
              </span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: getScoreColor(result.overallScore) }}>
              {result.overallScore}/100
            </div>
            <Badge 
              variant={getEvaluationBadgeVariant(result.evaluationStatus)}
              className={`mt-2 ${getEvaluationBadgeClass(result.evaluationStatus)}`}
            >
              {getEvaluationIcon(result.evaluationStatus)}
              {result.evaluationLabel}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Nutritional Analysis */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Leaf className="w-5 h-5 mr-2" style={{ color: '#1FC77C' }} />
            Analisi Nutrizionale
          </h3>
          
          <div className="space-y-3">
            {result.nutritionalValues.map((nutrient, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {getIconForNutrient(nutrient.icon)}
                  </span>
                  <div>
                    <div className="font-medium text-foreground">
                      {nutrient.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {nutrient.value}%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div 
                    className={`w-3 h-3 rounded-full ${getStatusColor(nutrient.status)}`}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {getStatusText(nutrient.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        {result.recommendation && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-primary mb-1">
                  Raccomandazione
                </h4>
                <p className="text-sm text-foreground">
                  {result.recommendation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {result.evaluationStatus === 'approved' && (
          <div className="text-center">
            <div className="text-2xl mb-2">🎉</div>
            <p className="text-lg font-medium text-primary">
              Ottima Scelta per il tuo Pet!
            </p>
          </div>
        )}

        {/* Warning Message for "Could be better" */}
        {result.evaluationStatus === 'could-be-better' && (
          <div className="text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <p className="text-lg font-medium text-secondary">
              Prodotto accettabile, ma esistono alternative migliori
            </p>
          </div>
        )}

        {/* Alert Message for "Not approved" */}
        {result.evaluationStatus === 'not-approved' && (
          <div className="text-center">
            <div className="text-2xl mb-2">❌</div>
            <p className="text-lg font-medium text-muted-foreground">
              Ti consigliamo di scegliere un prodotto diverso
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductAnalysisCard;