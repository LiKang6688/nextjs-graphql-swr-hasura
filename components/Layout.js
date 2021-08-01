import React from "react";
import Link from "next/link";
import "../styles/style.css";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <header>
        <ul>
          <li>
            <Link href="/swr/fetch-query">
              <a>Fetch Query</a>
            </Link>
          </li>
          <li>
            <Link href="/swr/fetch-mutation">
              <a>Fetch Mutation</a>
            </Link>
          </li>
          <li>
            <Link href="/swr/fetch-subscription">
              <a>Fetch Subscription</a>
            </Link>
          </li>
        </ul>

        <ul>
          <li>
            <Link href="/swr/graphql-request-query">
              <a>Graphql Request Query</a>
            </Link>
          </li>
          <li>
            <Link href="/swr/graphql-request-mutation">
              <a>Graphql Quest Mutation</a>
            </Link>
          </li>
        </ul>

        <ul>
          <li>
            <Link href="/swr/apollo-client-query">
              <a>Apollo Client Query</a>
            </Link>
          </li>
          <li>
            <Link href="/swr/apollo-client-muation">
              <a>Apollo Client Mutations</a>
            </Link>
          </li>
          <li>
            <Link href="/swr/apollo-client-subscription">
              <a>Apollo Client Subscription</a>
            </Link>
          </li>
        </ul>

        <ul>
          <li>
            <Link href="/react-query/apollo-client-query">
              <a>Apollo Client Query (react query)</a>
            </Link>
          </li>
        </ul>
      </header>
      {children}
    </div>
  );
}
