import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: relatedArticles } = useQuery({
    queryKey: ["related-articles", article?.category, article?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, slug, excerpt, image_url, category")
        .eq("published", true)
        .eq("category", article?.category || "")
        .neq("id", article?.id || "")
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: !!article?.category && !!article?.id,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-[400px] w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Article non trouvé</h1>
          <p className="text-muted-foreground mb-8">
            L'article que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Button asChild>
            <Link to="/articles">Retour aux articles</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const formattedDate = article.created_at
    ? format(new Date(article.created_at), "d MMMM yyyy", { locale: fr })
    : "";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.image_url,
    author: {
      "@type": "Person",
      name: article.author || "Happy Hair Lab",
    },
    publisher: {
      "@type": "Organization",
      name: "Happy Hair Lab",
      logo: {
        "@type": "ImageObject",
        url: "https://happyhairlab.com/logo.jpg",
      },
    },
    datePublished: article.created_at,
    dateModified: article.updated_at || article.created_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://happyhairlab.com/article/${article.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://happyhairlab.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Articles",
        item: "https://happyhairlab.com/articles",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://happyhairlab.com/article/${article.slug}`,
      },
    ],
  };

  return (
    <Layout>
      <Helmet>
        <title>{article.title} | Happy Hair Lab - Conseils Capillaires</title>
        <meta name="description" content={article.excerpt || ""} />
        <meta name="author" content={article.author || "Happy Hair Lab"} />
        <link rel="canonical" href={`https://happyhairlab.com/article/${article.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt || ""} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://happyhairlab.com/article/${article.slug}`} />
        {article.image_url && <meta property="og:image" content={article.image_url} />}
        <meta property="article:published_time" content={article.created_at || ""} />
        <meta property="article:author" content={article.author || "Happy Hair Lab"} />
        <meta property="article:section" content={article.category || "Soins capillaires"} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt || ""} />
        {article.image_url && <meta name="twitter:image" content={article.image_url} />}
        
        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <article className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux articles
          </Link>
        </nav>

        {/* Header */}
        <header className="max-w-4xl mx-auto mb-12">
          {article.category && (
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              {article.category}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
            {article.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
            )}
            {formattedDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={article.created_at || ""}>{formattedDate}</time>
              </div>
            )}
            {article.read_time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.read_time} min de lecture</span>
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {article.image_url && (
          <div className="max-w-4xl mx-auto mb-12">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-auto rounded-2xl shadow-lg object-cover aspect-video"
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          {article.excerpt && (
            <p className="text-xl text-muted-foreground mb-8 font-medium leading-relaxed">
              {article.excerpt}
            </p>
          )}
          
          <div 
            className="prose prose-lg max-w-none
              prose-headings:text-foreground prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-6
              prose-strong:text-foreground prose-strong:font-semibold
              prose-ul:my-6 prose-ul:pl-6
              prose-li:text-foreground/80 prose-li:mb-2
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: formatContent(article.content || "") }}
          />
        </div>

        {/* Related Articles */}
        {relatedArticles && relatedArticles.length > 0 && (
          <section className="max-w-4xl mx-auto mt-16 pt-12 border-t border-border">
            <h2 className="text-2xl font-bold text-foreground mb-8">Articles similaires</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  to={`/article/${related.slug}`}
                  className="group block"
                >
                  {related.image_url && (
                    <div className="aspect-video rounded-xl overflow-hidden mb-4">
                      <img
                        src={related.image_url}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
};

// Helper function to format content with proper HTML
const formatContent = (content: string): string => {
  // Convert markdown-like formatting to HTML
  let html = content
    // Convert ## headers to h2
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    // Convert ### headers to h3
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    // Convert **bold** to strong
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Convert *italic* to em
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Convert bullet points
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Wrap consecutive li elements in ul
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Convert double newlines to paragraphs
    .split('\n\n')
    .map(para => {
      if (para.startsWith('<h') || para.startsWith('<ul')) {
        return para;
      }
      return `<p>${para}</p>`;
    })
    .join('\n');

  return html;
};

export default ArticleDetail;
