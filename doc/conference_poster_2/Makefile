file = poster
compile = pdflatex -shell-escape $(file).tex

all:
	make clean; \
	$(compile);

.PHONY: clean
clean:
	rm *.aux *.bbl *.bcf *.blg *.log *.out *.run.xml *.toc; rm -rf _minted-report *.pygtex

