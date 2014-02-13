<?php 

namespace Postsixteen\Csv;

class Csv implements CsvInterface  {

    // This class creates a CSV from data returned via DB:: Laravel functionality.

    public function generateCsv($data = null)
    {
        // If no data has been passed to the function
    	if ($data == null) {
    		throw new \Exception('Csv has not been generated');
    	}

        // The filename is set and the current time is added.
        // Open and write a new file.
        $filename ="uploads/csv/extract_" . time() . ".csv";
        $file = fopen(public_path() . "/" . $filename, "w");

        // If the filepath could not be created or opened:
        if(!$file) {
            throw new \Exception('File path could not be opened');
        }

        //Ensure at least one row of data has been returned.
        if(!$data[0]) {
            throw new \Exception('Data could not be handled correctly');
        }

        foreach ($data[0] as $k => $v)
        {
            $emptyRowArray[] = $k;
        }
        fputcsv($file, $emptyRowArray);
       


        foreach ($data as $k => $v)
        {
            $emptyRowArray = array();
            foreach ($data[$k] as $key => $val)
            {
             $emptyRowArray[] = $val;
            }
            fputcsv($file, $emptyRowArray);
        }
        fclose($file);

        $return['raw_name'] = $filename;
        $return['title'] = "All Applications";
        
        return $return;
        
    }

}