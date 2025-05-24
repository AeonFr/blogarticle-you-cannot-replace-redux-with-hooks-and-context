/**
 * Wrapper arround @code-surfer/standalone code editor (based on Prisma)
 */

import Highlight, { defaultProps } from "prism-react-renderer";
import { useEffect, useMemo, useRef } from "react";
import { motion } from "motion/react";
import { lcs } from "fast-myers-diff";
import "../styles/code-block.css";
import * as styles from "./styles.css";

type CSymbol = number;

const createSymbol = (): CSymbol => {
  // Since they should be used as keys for React, we can't use Symbol()
  return Math.random();
};

const Lines = ({
  className,
  style,
  tokens,
  getLineProps,
  getTokenProps,
  highlightedLines,
  code,
}) => {
  const previousCodeRef = useRef<string>(code);
  const previousSymbols = useRef<CSymbol[]>([]);
  const previousTokens = useRef<any[]>(tokens);

  /* A collection of symbols where each item (that represents a line of code) has a stable identity ammong diffs. */
  const tokenSymbols = useMemo(() => {
    const previousCode = previousCodeRef.current;

    if (previousCode === code) {
      // initial render
      previousSymbols.current = tokens.map(() => createSymbol());
    }
    const symbols = previousSymbols.current;

    const diffResult = Array.from(
      lcs(previousCode.split("\n"), code.split("\n"))
    );

    let skipIndexes = 0;

    const newSymbols = [...tokens].reduce((acc, token, index) => {
      if (diffResult[0] && diffResult[0][1] === index) {
        const [prevIndex, currIndex, length] = diffResult[0];
        diffResult.shift();
        skipIndexes = length - 1;

        acc.push(...symbols.slice(prevIndex, prevIndex + length));
      } else if (skipIndexes > 0) {
        skipIndexes--;
      } else {
        acc.push(createSymbol());
      }
      return acc;
    }, []);

    return newSymbols;
  }, [code]); // tokens change alongside code, but code is a string so its safe to compare it

  const tokensWithStableIdentities = useMemo(() => {
    const result = tokenSymbols.map((symbol, index) => {
      if (previousSymbols.current[index] === symbol) {
        return previousTokens[index];
      } else {
        return tokens[index];
      }
    });

    return result;
  }, [code]);

  useEffect(() => {
    previousCodeRef.current = code;
    previousSymbols.current = tokenSymbols;
    previousTokens.current = tokens;
  }, [code]);

  const getRealLineProps = (token, index) => {
    const lineProps = getLineProps({ line: token });
    const highlighted = highlightedLines?.includes(index);
    const notHighlighted = highlightedLines?.length && !highlighted;

    lineProps.className =
      lineProps.className +
      " " +
      (highlighted ? styles.highlightedCodeLine : "") +
      " " +
      (notHighlighted ? styles.nonHighlightedCodeLine : "");

    return lineProps;
  };

  const iterateLines = (iteratorFn) => {
    const callIterator = (token, index, animationStyles) => {
      const lineProps = getLineProps({ line: token });
      const highlighted = highlightedLines?.includes(index);
      const notHighlighted = highlightedLines?.length && !highlighted;

      lineProps.className =
        lineProps.className +
        " " +
        (highlighted ? styles.highlightedCodeLine : "") +
        " " +
        (notHighlighted ? styles.nonHighlightedCodeLine : "");

      return iteratorFn({ animationStyles, token, lineProps });
    };

    return tokens.map((token, index) => callIterator(token, index, null));
  };

  return (
    <pre
      className={className}
      style={style}
    >
      {tokens.map((token, i) => {
        const lineProps = getRealLineProps(token, i);

        return (
          <motion.div
            key={`motion-${i}`}
            initial={{ opacity: 0, height: 0, }}
            animate={{ opacity: 1, height: 20 }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className={lineProps.className}>
              {token.map((token, key) => (
                <span {...getTokenProps({ token, key })} key={key} />
              ))}
            </div>
          </motion.div>
        );
      })}
    </pre>
  );
};

export default function CodeBlock({
  children,
  highlightedLines = [],
  className,
}: {
  children: any;
  highlightedLines: number[];
  className?: string;
}) {
  const code = children.props.children;

  return useMemo(
    () => (
      <Highlight
        {...defaultProps}
        code={code}
        theme={undefined}
        language={children.props.className?.replace(/^language-/, "")}
      >
        {({
          className: highlightClassName,
          style,
          tokens,
          getLineProps,
          getTokenProps,
        }) => {
          return (
            <Lines
              className={`${className || ""} ${highlightClassName}`}
              style={style}
              tokens={tokens}
              getLineProps={getLineProps}
              getTokenProps={getTokenProps}
              highlightedLines={highlightedLines}
              code={code}
            />
          );
        }}
      </Highlight>
    ),
    [code, highlightedLines]
  );
}
