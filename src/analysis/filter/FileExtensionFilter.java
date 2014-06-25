package analysis.filter;

import analysis.DockingAnalyzer;

public class FileExtensionFilter extends TokenDivisionFilter {

	public FileExtensionFilter(DockingAnalyzer stream) {
		super(stream,new String[]{"."});
		// TODO Auto-generated constructor stub
	}

	@Override
	public void analyze() throws Exception {
		// TODO Auto-generated method stub
		super.analyze();
	}
}
