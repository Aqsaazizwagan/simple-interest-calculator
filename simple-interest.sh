#!/bin/bash
# ------------------------------------------------------------------
# [Author]: Aqsa Aziz Wagan
# [Roll No]: 2K23/CSM/21
# [Institute]: Institute of Mathematics & Computer Science (IMCS)
# [University]: University of Sindh, Jamshoro
# [Description]: A Bash script to calculate simple interest given
#                principal, annual rate of interest, and time period in years.
#
# Formula:
#   Simple Interest = (p * r * t) / 100
#   Total Amount    = p + Simple Interest
# ------------------------------------------------------------------

echo "=========================================================="
echo "         CYBER SIMPLE INTEREST CALCULATOR (BASH CLI)      "
echo "         Author: Aqsa Aziz Wagan (2K23/CSM/21)            "
echo "=========================================================="

# Read Principal
echo -n "Enter principal amount (p): "
read p

# Read Annual Rate of Interest
echo -n "Enter annual rate of interest in % (r): "
read r

# Read Time in Years
echo -n "Enter time period in years (t): "
read t

# Input Validation
if [ -z "$p" ] || [ -z "$r" ] || [ -z "$t" ]; then
    echo "Error: All input parameters (principal, rate, and time) are required."
    exit 1
fi

# Calculation using bc (arbitrary precision calculator)
interest=$(echo "scale=2; ($p * $t * $r) / 100" | bc -l 2>/dev/null)
if [ $? -ne 0 ] || [ -z "$interest" ]; then
    # Fallback to awk if bc is not present
    interest=$(awk "BEGIN {printf \"%.2f\", ($p * $t * $r) / 100}")
    total=$(awk "BEGIN {printf \"%.2f\", ($p + $interest)}")
else
    total=$(echo "scale=2; $p + $interest" | bc -l)
fi

echo "----------------------------------------------------------"
echo "RESULTS SUMMARY:"
echo "Principal Amount (p) : $p"
echo "Annual Interest Rate : $r%"
echo "Time Horizon (years) : $t"
echo "Simple Interest (SI) : $interest"
echo "Total Maturity Value : $total"
echo "=========================================================="
