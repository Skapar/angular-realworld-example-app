import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { ArticleListConfig } from "../models/article-list-config.model";
import { Article } from "../models/article.model";

@Injectable({ providedIn: "root" })
export class ArticlesService {
  constructor(private readonly http: HttpClient) {}

  private mockArticles: Article[] = [
    {
      slug: "mock-article-1",
      title: "Mock Article 1",
      description: "This is the first mock article.",
      body: "Content of the first mock article.",
      tagList: ["mock", "test"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorited: false,
      favoritesCount: 10,
      author: {
        username: "mockauthor1",
        bio: "Author 1 bio",
        image: "https://example.com/avatar1.jpg",
        following: false,
      },
    },
  ];

  query(
    config: ArticleListConfig,
  ): Observable<{ articles: Article[]; articlesCount: number }> {
    const filteredArticles = this.mockArticles.filter((article) =>
      (
        Object.keys(config.filters || {}) as (keyof typeof config.filters)[]
      ).every((key) => article[key as keyof Article] === config.filters[key]),
    );

    return of({
      articles: filteredArticles,
      articlesCount: filteredArticles.length,
    });
  }

  get(slug: string): Observable<Article> {
    const article = this.mockArticles.find((article) => article.slug === slug);

    if (!article) {
      throw new Error("Not Found");
    }

    return of(article);
  }

  delete(slug: string): Observable<void> {
    return of(undefined);
  }

  create(article: Partial<Article>): Observable<Article> {
    const newArticle: Article = {
      ...article,
      slug: `mock-article-${this.mockArticles.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorited: false,
      favoritesCount: 0,
      tagList: article.tagList || [],
      author: {
        username: "mockauthor",
        bio: "Mock bio",
        image: "https://via.placeholder.com/150",
        following: false,
      },
    } as Article;

    this.mockArticles.push(newArticle);
    return of(newArticle);
  }

  update(article: Partial<Article>): Observable<Article> {
    const existingArticleIndex = this.mockArticles.findIndex(
      (mockArticle) => mockArticle.slug === article.slug,
    );

    this.mockArticles[existingArticleIndex] = {
      ...this.mockArticles[existingArticleIndex],
      ...article,
      updatedAt: new Date().toISOString(),
    };

    return of(this.mockArticles[existingArticleIndex]);
  }

  favorite(slug: string): Observable<Article> {
    const article = this.mockArticles.find(
      (mockArticle) => mockArticle.slug === slug,
    );

    if (!article) {
      throw new Error(`Article with slug "${slug}" not found`);
    }

    article.favorited = true;
    article.favoritesCount += 1;

    return of(article);
  }

  unfavorite(slug: string): Observable<void> {
    const article = this.mockArticles.find(
      (mockArticle) => mockArticle.slug === slug,
    );

    if (!article) {
      throw new Error(`Article with slug "${slug}" not found`);
    }

    article.favorited = false;
    article.favoritesCount = Math.max(0, article.favoritesCount - 1);

    return of(undefined);
  }
}
