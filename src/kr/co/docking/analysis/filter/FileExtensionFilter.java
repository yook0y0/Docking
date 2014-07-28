package kr.co.docking.analysis.filter;

import kr.co.docking.analysis.analysis.DockingAnalyzer;

public class FileExtensionFilter extends TokenDivisionFilter {

	public FileExtensionFilter(DockingAnalyzer stream) 
	{
		super(stream,new String[]{"."});
	}

	@Override
	public void analyze() throws Exception {
		// TODO Auto-generated method stub
		super.analyze();
	}
}
