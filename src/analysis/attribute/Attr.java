package analysis.attribute;

import java.util.HashMap;
import java.util.Map;


public class Attr {

	public static int PROCESS_NO_PROCESS = 0;
	public static int PROCESS_TOKENIZER = 1;
	public static int PROCESS_REGISTER = 2;
	public static int PROCESS_FILTER = 3;
	
	public static int ATTRSET_FILE_DATA = 1;
	
	public static String TEST_FILE_LOCAL_PATH = "C:\\test\\test\\5.txt";
	public static String TEST_ZIPFILE_LOCAL_PATH = "C:\\test\\test.zip";
	public static String START_PAGE = "start.html";
	
	public static String WEB_SITE_ADDRESS = "http://localhost:8089/Docking/";
	public static boolean EDITOR_DATA_LOCALSAVE = true;
	
	public static String	backUpData = "0";
	public static Map<String,String>	socketList = new HashMap<String,String>();
}
