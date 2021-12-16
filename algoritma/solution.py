
# Solution 1


class Solution:
    def reverseOnlyLetters(self, S: str) -> str:
        S = list(S)
        c = [c for c in S if c.isalpha()]
        for i in range(-1, -len(S)-1, -1):
            if S[i].isalpha():
                S[i] = c.pop(0)
        return "".join(S)

# Solution 2


class Solution:
    def longest(self, s):
        sl = s.split()
        res = ""
        for word in sl:
            if len(word) > len(res):
                res = word

        return res

# Soluti0n 3


class Solution:
    def countWords(self, input, query):
        count = [0] * len(query)
        j = 0
        for i in range(len(query)):
            for j in range(len(input)):
                if input[j] == query[i]:
                    count[i] += 1

        return count


# Solution 4
class Solution:
    def diagonalDifference(self, matrix):

        total = 0
        n = len(matrix[0])-1
        mid = n // 2

        for i in range(len(matrix)):

            total += matrix[i][i]

            if i != n-i:
                total -= matrix[i][n-i]

        if n % 2 == 1:

            total -= matrix[mid][mid]

        return total
