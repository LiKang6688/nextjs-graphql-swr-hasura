import React, { Component } from "react";
import Link from "next/link";
import "../styles/style.css";

class Layout extends Component {
  render() {
    const { children } = this.props;
    return (
      <div className="layout">
        <header>
          <ul>
            <li>
              <Link href="/fetch-query">
                <a>Fetch Query</a>
              </Link>
            </li>
            <li>
              <Link href="/fetch-mutation">
                <a>Fetch Mutation</a>
              </Link>
            </li>
            <li>
              <Link href="/subscriptions">
                <a>Subscriptions</a>
              </Link>
            </li>
            <li>
              <Link href="/graphql-request-query">
                <a>Graphql Request Query</a>
              </Link>
            </li>
            <li>
              <Link href="/graphql-request-mutation">
                <a>Graphql Quest Mutation</a>
              </Link>
            </li>

            <li>
              <Link href="/apollo-client-query">
                <a>Apollo Client Query</a>
              </Link>
            </li>
          </ul>
        </header>
        {children}
      </div>
    );
  }
}

export default Layout;
