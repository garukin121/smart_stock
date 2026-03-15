def fuzzy_tsukamoto(demand: float, stock: float) -> float:
    """
    MVP: Hardcoded membership functions and rules for Fuzzy Tsukamoto.
    Demand Range: [5, 25] -> Turun, Stabil, Naik
    Stock Range: [0, 20] -> Sedikit, Sedang, Banyak
    Restock Range: [0, 50] -> Sedikit, Sedang, Banyak
    """
    # 1. FUZZIFICATION
    # Demand (Permintaan)
    # Turun: 1 at 5, 0 at 15
    mu_demand_turun = max(0, min(1, (15 - demand) / 10)) if demand < 15 else 0
    # Stabil: 0 at 5, 1 at 15, 0 at 25
    if demand <= 5 or demand >= 25:
        mu_demand_stabil = 0
    elif demand <= 15:
        mu_demand_stabil = (demand - 5) / 10
    else:
        mu_demand_stabil = (25 - demand) / 10
    # Naik: 0 at 15, 1 at 25
    mu_demand_naik = max(0, min(1, (demand - 15) / 10)) if demand > 15 else 0

    # Stock (Sisa Stok)
    # Sedikit: 1 at 0, 0 at 10
    mu_stock_sedikit = max(0, min(1, (10 - stock) / 10)) if stock < 10 else 0
    # Sedang: 0 at 0, 1 at 10, 0 at 20
    if stock <= 0 or stock >= 20:
        mu_stock_sedang = 0
    elif stock <= 10:
        mu_stock_sedang = (stock - 0) / 10
    else:
        mu_stock_sedang = (20 - stock) / 10
    # Banyak: 0 at 10, 1 at 20
    mu_stock_banyak = max(0, min(1, (stock - 10) / 10)) if stock > 10 else 0

    # 2. INFERENCE (Rules)
    # R1: IF Permintaan NAIK AND Sisa Stok BANYAK THEN Saran SEDANG
    # SEDANG: 0 at 0, 1 at 25, 0 at 50 => z is between 0 and 50.
    # To simplify Tsukamoto inverse for SEDANG (triangle), we can pick the ascending or descending side depending on logic, or just use a constant implication (Takagi-Sugeno style 0-order)
    # For Tsukamoto strictly, monotonic functions are required. Let's assume Output Restock ranges monotonically:
    # Sedikit (Turun): 50 to 0 -> z = 50 - 50*alpha
    # Banyak (Naik): 0 to 50 -> z = 50 * alpha
    # Sedang: we can just map it to fixed 25 for simplicity or use z = 25.
    
    rules = []
    
    # R1: IF Permintaan NAIK AND Sisa Stok BANYAK THEN Saran SEDANG
    a1 = min(mu_demand_naik, mu_stock_banyak)
    z1 = 25.0 # Fixed for Sedang
    if a1 > 0: rules.append((a1, z1))

    # R2: IF Permintaan NAIK AND Sisa Stok SEDIKIT THEN Saran BANYAK
    a2 = min(mu_demand_naik, mu_stock_sedikit)
    z2 = 50.0 * a2 # Inverse of Banyak (Naik: 0 to 50) -> z = 50 * alpha. Wait, monotonic Naik is z = 50 * alpha.
    if a2 > 0: rules.append((a2, z2))

    # R3: IF Permintaan TURUN AND Sisa Stok BANYAK THEN Saran SEDIKIT
    a3 = min(mu_demand_turun, mu_stock_banyak)
    z3 = 50.0 - (50.0 * a3) # Inverse of Sedikit (Turun: 50 to 0) -> z = 50 - 50*alpha
    if a3 > 0: rules.append((a3, z3))
        
    # Extra rules to cover other conditions simply:
    # R4: IF Permintaan STABIL AND Sisa Stok SEDANG THEN Saran SEDANG
    a4 = min(mu_demand_stabil, mu_stock_sedang)
    z4 = 25.0
    if a4 > 0: rules.append((a4, z4))

    # R5: IF Permintaan TURUN AND Sisa Stok SEDIKIT THEN Saran SEDANG
    a5 = min(mu_demand_turun, mu_stock_sedikit)
    z5 = 25.0
    if a5 > 0: rules.append((a5, z5))
    
    # R6: IF Permintaan NAIK AND Sisa Stok SEDANG THEN Saran BANYAK
    a6 = min(mu_demand_naik, mu_stock_sedang)
    z6 = 50.0 * a6
    if a6 > 0: rules.append((a6, z6))

    # 3. DEFUZZIFICATION (WA)
    sum_a = sum([r[0] for r in rules])
    sum_az = sum([r[0] * r[1] for r in rules])
    
    if sum_a == 0:
        return 0.0 # Default if no rules fire
    
    return sum_az / sum_a

# Example test
if __name__ == "__main__":
    print(f"Demand 18, Stock 3 -> Restock = {fuzzy_tsukamoto(18, 3):.2f}")
