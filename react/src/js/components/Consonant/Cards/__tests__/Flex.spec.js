import { screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Card from "../Card";

import { DEFAULT_PROPS_FLEX } from "../../Testing/Constants/Card";

import setup from "../../Testing/Utils/Settings";
import { testA11yForConfigs } from "../../Testing/Utils/a11yTest";

const renderCard = setup(Card, DEFAULT_PROPS_FLEX, { wrapInList: true });

const cardStyle = "flex-card";

describe(`Consonant/Card/${cardStyle}`, () => {
  test("should be able to render a card header", () => {
    renderCard({ cardStyle });

    const headerElement = screen.queryByTestId("consonant-Card-header");
    expect(headerElement).not.toBeNull();
  });

  test("should be able to render a detail/eyebrow text", () => {
    renderCard({ cardStyle });

    const labelElement = screen.queryByTestId("consonant-Card-label");
    expect(labelElement).not.toBeNull();
  });

  test("should be able to render a card title", () => {
    renderCard({ cardStyle });

    const titleElement = screen.queryByTestId("consonant-Card-title");
    expect(titleElement).not.toBeNull();
  });

  test("should be able to render a card text", () => {
    renderCard({ cardStyle });

    const textElement = screen.queryByTestId("consonant-Card-text");
    expect(textElement).not.toBeNull();
  });

  test("should be able to render a card footer", () => {
    renderCard({ cardStyle });

    const footerElement = screen.queryByTestId("consonant-Card-footer");
    expect(footerElement).not.toBeNull();
  });

  test("should hide the card header when imageOption is hidden", () => {
    renderCard(
      { cardStyle },
      {
        collection: {
          flexCard: { imageOption: "hidden" },
        },
      }
    );

    const headerElement = screen.queryByTestId("consonant-Card-header");
    expect(headerElement).toBeNull();
  });

  test("should apply the imageOption class to the card header", () => {
    renderCard(
      { cardStyle },
      {
        collection: {
          flexCard: { imageOption: "image-small-center" },
        },
      }
    );

    const headerElement = screen.getByTestId("consonant-Card-header");
    expect(headerElement).toHaveClass("image-small-center");
  });

  test("should hide the detail text when hideDetails is true", () => {
    renderCard(
      { cardStyle },
      {
        collection: {
          flexCard: { hideDetails: true },
        },
      }
    );

    const labelElement = screen.queryByTestId("consonant-Card-label");
    expect(labelElement).toBeNull();
  });

  test("should hide the card description when hideDescription is true", () => {
    renderCard(
      { cardStyle },
      {
        collection: {
          flexCard: { hideDescription: true },
        },
      }
    );

    const textElement = screen.queryByTestId("consonant-Card-text");
    expect(textElement).toBeNull();
  });

  test("should apply the text-center class to the card when textAlign is text-center", () => {
    renderCard(
      { cardStyle },
      {
        collection: {
          flexCard: { textAlign: "text-center" },
        },
      }
    );

    const cardElement = screen.getByTestId("consonant-Card");
    expect(cardElement).toHaveClass("text-center");
  });

  test("should apply the text-large class to the card when textSize is text-large", () => {
    renderCard(
      { cardStyle },
      {
        collection: {
          flexCard: { textSize: "text-large" },
        },
      }
    );

    const cardElement = screen.getByTestId("consonant-Card");
    expect(cardElement).toHaveClass("text-large");
  });

  test("should render product info when detailsTextOption is productName and a matching product exists", () => {
    renderCard(
      {
        cardStyle,
        contentArea: { detailText: "some details" },
      },
      {
        collection: {
          detailsTextOption: "productName",
        },
        products: {
          acrobat: {
            tagID: "some details",
            title: "Acrobat",
            tagImage: "https://example.com/acrobat-icon.svg",
          },
        },
      }
    );

    const productTitle = screen.getByText("Acrobat");
    expect(productTitle).toBeInTheDocument();
  });

  test("should not render the detail text when product info is shown", () => {
    renderCard(
      {
        cardStyle,
        contentArea: {
          detailText: "some details",
        },
      },
      {
        collection: {
          detailsTextOption: "productName",
        },
        products: {
          acrobat: {
            tagID: "some details",
            title: "Acrobat",
            tagImage: "https://example.com/acrobat-icon.svg",
          },
        },
      }
    );

    const detailText = screen.queryByText("some details");
    expect(detailText).toBeNull();
  });

  test("should hide the detail text when detailsTextOption is productName but no product matches", () => {
    renderCard(
      {
        cardStyle,
        contentArea: { detailText: "some details" },
      },
      {
        collection: {
          detailsTextOption: "productName",
        },
        products: {
          acrobat: {
            tagID: "unrelated-tag",
            title: "Acrobat",
            tagImage: "https://example.com/acrobat-icon.svg",
          },
        },
      }
    );

    expect(screen.queryByText("some details")).toBeNull();
    expect(screen.queryByTestId("consonant-Card-label")).toBeNull();
    expect(
      screen.queryByTestId("consonant-Card-label-product-info")
    ).toBeNull();
  });

  test("should render a card title with a heading role and aria-level", () => {
    renderCard({ cardStyle });

    const titleElement = screen.getByTestId("consonant-Card-title");
    expect(titleElement).toHaveAttribute("aria-level");
  });

  describe("showDateOnFooter", () => {
    const cardDate = "2024-01-15T12:00:00.000Z";

    test("should render the card date in the footer when showDateOnFooter is true", () => {
      renderCard(
        { cardStyle, cardDate },
        {
          collection: {
            flexCard: { showDateOnFooter: true },
          },
        }
      );

      expect(screen.getByText("1/15/2024")).toBeInTheDocument();
    });

    test("should not render the card date in the footer when showDateOnFooter is false", () => {
      renderCard(
        { cardStyle, cardDate },
        {
          collection: {
            flexCard: { showDateOnFooter: false },
          },
        }
      );

      expect(screen.queryByText("1/15/2024")).toBeNull();
    });

    test("should not render the card date in the footer when an endDate is set", () => {
      renderCard(
        { cardStyle, cardDate, endDate: "2024-02-01T12:00:00.000Z" },
        {
          collection: {
            flexCard: { showDateOnFooter: true },
          },
        }
      );

      expect(screen.queryByText("1/15/2024")).toBeNull();
    });
  });

  // Accessibility tests with jest-axe
  testA11yForConfigs(renderCard, [
    {
      name: "Default flex card",
      props: { cardStyle },
    },
    {
      name: "Flex card with hidden image",
      props: {
        cardStyle,
        overlays: {},
      },
    },
  ]);
});
