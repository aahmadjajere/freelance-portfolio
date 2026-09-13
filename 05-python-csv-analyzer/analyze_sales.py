import csv
from collections import defaultdict
from pathlib import Path

INPUT = Path(__file__).with_name("sales.csv")
OUTPUT = Path(__file__).with_name("sales_report.txt")


def load_rows(path):
    with path.open("r", newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def analyze(rows):
    total_revenue = 0.0
    total_units = 0
    by_category = defaultdict(float)
    by_product = defaultdict(float)

    for row in rows:
        quantity = int(row["quantity"])
        revenue = quantity * float(row["unit_price"])
        total_units += quantity
        total_revenue += revenue
        by_category[row["category"]] += revenue
        by_product[row["product"]] += revenue

    return total_revenue, total_units, dict(by_category), dict(by_product)


def write_report(total_revenue, total_units, by_category, by_product, path):
    top_product = max(by_product, key=by_product.get)
    lines = [
        "SALES SUMMARY",
        "=" * 40,
        f"Total units sold: {total_units}",
        f"Total revenue: ${total_revenue:,.2f}",
        f"Top product by revenue: {top_product}",
        "",
        "Revenue by category:"
    ]
    for category, revenue in sorted(by_category.items(), key=lambda x: x[1], reverse=True):
        lines.append(f"- {category}: ${revenue:,.2f}")
    path.write_text("\n".join(lines), encoding="utf-8")


def main():
    rows = load_rows(INPUT)
    total_revenue, total_units, by_category, by_product = analyze(rows)
    write_report(total_revenue, total_units, by_category, by_product, OUTPUT)
    print(f"Report written to: {OUTPUT}")


if __name__ == "__main__":
    main()
