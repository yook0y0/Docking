package util;

import analysis.DockingAnalyzer;
import analysis.attribute.Attr;
import analysis.filter.FileExtensionFilter;
import analysis.filter.FileReaderFilter;
import analysis.filter.FileUnzipFilter;
import analysis.filter.StringReplaceFilter;
import analysis.register.FilePathRegister;

public class AnalyzerFactory {
	
	public static String SRC_ADDRESS;
	public static String DEST_ADDRESS;
	
	public final static int ANALYZER_FILE_UNZIP;
	public final static int ANALYZER_FILE_READER;
	public final static int ANALYZER_FILE_UNZIP_ADDRESS_REROUTING;
	public final static int ANALYZER_FILE_UNZIP_EXTENSION;
	static {
		SRC_ADDRESS = "src=\"./";
		DEST_ADDRESS = "src=\"./DATA";
		
		ANALYZER_FILE_UNZIP = 0;
		ANALYZER_FILE_READER = 1;
		ANALYZER_FILE_UNZIP_ADDRESS_REROUTING = 2;
		ANALYZER_FILE_UNZIP_EXTENSION = 3;
	}
	
	public static DockingAnalyzer getAnalyzer(int type,String rsc) {
		if(type == ANALYZER_FILE_UNZIP) {
			return createFileUnzipAnalyzer(rsc);
		} else if(type == ANALYZER_FILE_READER) {
			return createFileReadAnalyzer(rsc);
		} else if(type == ANALYZER_FILE_UNZIP_ADDRESS_REROUTING) {
			return createFileDataReplaceAnalyzer(rsc,SRC_ADDRESS,DEST_ADDRESS);
		} else if(type == ANALYZER_FILE_UNZIP_EXTENSION) {
			return createFileExtensionChkAnlayzer(rsc);
		} 

		return null;
	}

	private static DockingAnalyzer createFileUnzipAnalyzer(String rsc) {
		return new FileUnzipFilter(new FilePathRegister(rsc));
	}

	private static DockingAnalyzer createFileReadAnalyzer(String rsc) {
		return new FileReaderFilter(new FilePathRegister(rsc));
	}

	private static DockingAnalyzer createFileDataReplaceAnalyzer(String rsc, String src, String destSrc) {
		return new StringReplaceFilter(new FileUnzipFilter(new FilePathRegister(rsc)),src,destSrc);
	}
	
	private static DockingAnalyzer createFileExtensionChkAnlayzer(String rsc) {
		return new FileExtensionFilter(new FileUnzipFilter(new FilePathRegister(rsc)));
	}
}
