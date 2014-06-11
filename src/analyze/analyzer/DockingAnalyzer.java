package analyze.analyzer;

import analyze.attribute.DockingAttrSet;

public abstract class DockingAnalyzer extends DockingAttrSet{
	
	private String srcPath;
	
	public DockingAnalyzer(String srcPath) {
		super();
		this.srcPath = srcPath;
	}
	
	public String getSrcPath() {
		return srcPath;
	}

	public void setSrcPath(String srcPath) {
		this.srcPath = srcPath;
	}
}
